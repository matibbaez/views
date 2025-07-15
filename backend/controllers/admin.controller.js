import bcrypt from 'bcrypt';
import { Usuario, Producto, Venta, DetalleVenta } from '../models/index.js';
import { obtenerVentasPaginadas } from '../services/venta.service.js';
import { obtenerRegistrosAdmin } from '../services/estadisticas.service.js';

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

// --- Ventas (con paginación) ---
export const renderVentas = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { ventas, totalPages, currentPage } = await obtenerVentasPaginadas(page);

  res.render('admin/ventas', {
    ventas,
    totalPages,
    currentPage
  });
};

// --- Registros (productos + ventas destacadas) ---
export const renderRegistros = async (req, res) => {
  const { productosMasVendidos, ventasMasCaras } = await obtenerRegistrosAdmin();

  res.render('admin/registros', {
    productosMasVendidos,
    ventasMasCaras
  });
};
