const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

// GET: formulario de login
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// POST: procesar login
router.post('/login', async (req, res) => {
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
});

// GET: dashboard (por ahora solo para testear login)
router.get('/dashboard', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');

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

// GET: logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

const path = require('path');
const { Producto } = require('../models');

// GET: listar productos
router.get('/productos', async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  const productos = await Producto.findAll();
  res.render('admin/productos', { productos });
});

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// GET: formulario de edición
router.get('/productos/:id/editar', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');

  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');

  res.render('admin/producto-form', { producto });
});

// POST: actualizar producto
router.post('/productos/:id', upload.single('imagen'), async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');

  const datos = req.body;
  const nuevaImagen = req.file ? req.file.filename : producto.imagen;

  const nombre = datos.nombre?.trim();
  const artista = datos.artista?.trim();
  const precio = parseFloat(datos.precio);
  const fechaShow = datos.fechaShow ? new Date(datos.fechaShow) : null;

  // Validaciones
  if (!datos.tipo || !nombre || !artista || isNaN(precio)) {
    return res.render('admin/producto-form', {
      producto,
      error: 'Completá todos los campos con valores válidos.'
    });
  }

  if (precio <= 0) {
    return res.render('admin/producto-form', {
      producto,
      error: 'El precio debe ser mayor a cero.'
    });
  }

  if (datos.tipo === 'entrada' && (!fechaShow || fechaShow < new Date())) {
    return res.render('admin/producto-form', {
      producto,
      error: 'La fecha del show debe ser válida y no puede ser pasada.'
    });
  }

  await producto.update({
    tipo: datos.tipo,
    nombre,
    artista,
    precio,
    fechaShow: datos.tipo === 'entrada' ? fechaShow : null,
    imagen: nuevaImagen,
    activo: datos.activo ? true : false
  });

  res.redirect('/admin/productos');
});

// POST: eliminar producto
router.post('/productos/:id/eliminar', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');

  await Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/productos');
});

// GET: formulario de nuevo producto
router.get('/productos/nuevo', (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  res.render('admin/producto-form', { producto: null });
});

// POST: guardar producto nuevo
router.post('/productos', upload.single('imagen'), async (req, res) => {
  const datos = req.body;
  const imagen = req.file ? req.file.filename : null;

  const nombre = datos.nombre?.trim();
  const artista = datos.artista?.trim();
  const precio = parseFloat(datos.precio);
  const fechaShow = datos.fechaShow ? new Date(datos.fechaShow) : null;

  // Validaciones
  if (!datos.tipo || !nombre || !artista || isNaN(precio)) {
    return res.render('admin/producto-form', {
      producto: null,
      error: 'Completá todos los campos con valores válidos.'
    });
  }

  if (precio <= 0) {
    return res.render('admin/producto-form', {
      producto: null,
      error: 'El precio debe ser mayor a cero.'
    });
  }

  if (datos.tipo === 'entrada' && (!fechaShow || fechaShow < new Date())) {
    return res.render('admin/producto-form', {
      producto: null,
      error: 'La fecha del show debe ser válida y no puede ser pasada.'
    });
  }

  await Producto.create({
    tipo: datos.tipo,
    nombre,
    artista,
    precio,
    fechaShow: datos.tipo === 'entrada' ? fechaShow : null,
    imagen,
    activo: datos.activo ? true : false
  });

  res.redirect('/admin/productos');
});

const { Venta, DetalleVenta } = require('../models');

router.get('/ventas', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');

  const ventas = await Venta.findAll({
    include: [
      {
        model: DetalleVenta,
        as: 'detalles',
        include: [{ model: Producto, as: 'producto' }]
      }
    ],
    order: [['fecha', 'DESC']]
  });

  res.render('admin/ventas', { ventas });
});

module.exports = router;
