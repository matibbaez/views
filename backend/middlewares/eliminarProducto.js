import { Producto } from '../models/index.js';

export default async function eliminarProducto(req, res) {
  await Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/productos');
}
