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

router.post('/productos', authMiddleware, upload.single('imagen'), validarProducto, crearProducto);

router.post('/productos/:id', authMiddleware, upload.single('imagen'), async (req, res, next) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  req.producto = producto;
  next();
}, validarProducto, actualizarProducto);

export default router;
