const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const { Usuario, Producto, Venta, DetalleVenta } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const validarProducto = require('../middlewares/validacionesProducto');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// --- LOGIN ---
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) return res.render('admin/login', { error: 'Usuario no encontrado' });

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) return res.render('admin/login', { error: 'Contraseña incorrecta' });

  req.session.adminId = usuario.id;
  res.redirect('/admin/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// --- DASHBOARD ---
router.get('/dashboard', authMiddleware, async (req, res) => {
  const [
    totalProductos,
    totalVentas,
    unidadesVendidas,
    ultimaVenta
  ] = await Promise.all([
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
});

// --- PRODUCTOS ---
router.get('/productos', authMiddleware, async (req, res) => {
  const productos = await Producto.findAll();
  res.render('admin/productos', { productos });
});

router.get('/productos/nuevo', authMiddleware, (req, res) => {
  res.render('admin/producto-form', { producto: null });
});

router.post('/productos', authMiddleware, upload.single('imagen'), validarProducto, async (req, res) => {
  const datos = req.body;
  const imagen = req.file ? req.file.filename : null;

  await Producto.create({
    tipo: datos.tipo,
    nombre: datos.nombre.trim(),
    artista: datos.artista.trim(),
    precio: parseFloat(datos.precio),
    fechaShow: datos.tipo === 'entrada' ? new Date(datos.fechaShow) : null,
    imagen,
    activo: true
  });

  res.redirect('/admin/productos');
});

router.get('/productos/:id/editar', authMiddleware, async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  res.render('admin/producto-form', { producto });
});

router.post('/productos/:id', authMiddleware, upload.single('imagen'), async (req, res, next) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  req.producto = producto;
  next();
}, validarProducto, async (req, res) => {
  const datos = req.body;
  const producto = req.producto;
  const nuevaImagen = req.file ? req.file.filename : producto.imagen;

  await producto.update({
    tipo: datos.tipo,
    nombre: datos.nombre.trim(),
    artista: datos.artista.trim(),
    precio: parseFloat(datos.precio),
    fechaShow: datos.tipo === 'entrada' ? new Date(datos.fechaShow) : null,
    imagen: nuevaImagen,
    activo: datos.activo ? true : false
  });

  res.redirect('/admin/productos');
});

router.post('/productos/:id/eliminar', authMiddleware, async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/productos');
});

// --- VENTAS ---
router.get('/ventas', authMiddleware, async (req, res) => {
  const ventas = await Venta.findAll({
    include: [{
      model: DetalleVenta,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }]
    }],
    order: [['fecha', 'DESC']]
  });

  res.render('admin/ventas', { ventas });
});

module.exports = router;

