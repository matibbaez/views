import bcrypt from 'bcrypt';
import { Usuario, Producto, Venta, DetalleVenta } from '../models/index.js';

// --- Login ---
export const renderLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('admin/login', { error: 'Usuario no encontrado' });
  }

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) {
    return res.render('admin/login', { error: 'Contraseña incorrecta' });
  }

  req.session.adminId = usuario.id;
  res.redirect('/admin/dashboard');
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// --- Dashboard ---
export const renderDashboard = async (req, res) => {
  const [totalProductos, totalVentas, unidadesVendidas, ultimaVenta] = await Promise.all([
    Producto.count({ where: { activo: true } }),
    Venta.count(),
    DetalleVenta.sum('cantidad'),
    Venta.findOne({ order: [['fecha', 'DESC']] })
  ]);

  res.render('admin/dashboard', {
    totalProductos,
    totalVentas,
    unidadesVendidas,
    ultimaVenta
  });
};

// --- Ventas ---
export const renderVentas = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  // Contar total ventas sin incluir asociaciones para evitar conteo incorrecto
  const count = await Venta.count();

  const totalPages = Math.ceil(count / limit);

  // Validar página en rango
  let currentPage = page;
  if (page < 1) currentPage = 1;
  if (page > totalPages) currentPage = totalPages;

  const offset = (currentPage - 1) * limit;

  const ventas = await Venta.findAll({
    include: [{
      model: DetalleVenta,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }]
    }],
    order: [['fecha', 'DESC']],
    limit,
    offset
  });

  res.render('admin/ventas', {
    ventas,
    currentPage,
    totalPages
  });
};
