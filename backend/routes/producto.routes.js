import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import validarProducto from '../middlewares/validacionesProducto.js';
import upload from '../middlewares/uploadMiddleware.js';

import {
  crearProducto,
  actualizarProducto
} from '../controllers/producto.controller.js';

import { Producto } from '../models/index.js';

const router = express.Router();

// --- VISTAS ---
router.get('/productos', authMiddleware, async (req, res) => {
  const productos = await Producto.findAll();
  res.render('admin/productos', { productos });
});

router.get('/productos/nuevo', authMiddleware, (req, res) => {
  res.render('admin/producto-form', { producto: null });
});

router.get('/productos/:id/editar', authMiddleware, async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  res.render('admin/producto-form', { producto });
});

// --- CREACIÓN ---
router.post(
  '/productos',
  authMiddleware,
  upload.single('imagen'),
  validarProducto,
  crearProducto
);

// --- ACTUALIZACIÓN ---
router.post(
  '/productos/:id',
  authMiddleware,
  upload.single('imagen'),
  async (req, res, next) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.redirect('/admin/productos');
    req.producto = producto;
    next();
  },
  validarProducto,
  actualizarProducto
);

// --- ELIMINACIÓN ---
router.post('/productos/:id/eliminar', authMiddleware, async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/productos');
});

export default router;
