import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import validarProducto from '../middlewares/validacionesProducto.js';
import upload from '../middlewares/uploadMiddleware.js';
import buscarProducto from '../middlewares/buscarProducto.js';
import eliminarProducto from '../middlewares/eliminarProducto.js';

import {
  crearProducto,
  actualizarProducto
} from '../controllers/producto.controller.js';

import {
  mostrarListaProductos,
  mostrarFormularioNuevo,
  mostrarFormularioEdicion
} from '../controllers/producto.views.controller.js';

const router = express.Router();

// --- VISTAS ---
router.get('/productos', authMiddleware, mostrarListaProductos);
router.get('/productos/nuevo', authMiddleware, mostrarFormularioNuevo);
router.get('/productos/:id/editar', authMiddleware, mostrarFormularioEdicion);

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
  buscarProducto,
  validarProducto,
  actualizarProducto
);

// --- ELIMINACIÓN ---
router.post(
  '/productos/:id/eliminar',
  authMiddleware,
  eliminarProducto
);

export default router;
