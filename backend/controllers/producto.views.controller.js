import { Producto } from '../models/index.js';

export const mostrarListaProductos = async (req, res) => {
  const productos = await Producto.findAll();
  res.render('admin/productos', { productos });
};

export const mostrarFormularioNuevo = (req, res) => {
  res.render('admin/producto-form', { producto: null });
};

export const mostrarFormularioEdicion = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  res.render('admin/producto-form', { producto });
};
