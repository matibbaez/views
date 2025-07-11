import { Producto } from '../models/index.js';

export default async function buscarProducto(req, res, next) {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) {
    return res.redirect('/admin/productos');
  }
  req.producto = producto;
  next();
}
