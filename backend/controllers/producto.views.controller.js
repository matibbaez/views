import { Producto } from '../models/index.js';

export const mostrarListaProductos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows: productos, count } = await Producto.findAndCountAll({
    limit,
    offset,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(count / limit);

  res.render('admin/productos', {
    productos,
    currentPage: page,
    totalPages
  });
};

export const mostrarFormularioNuevo = (req, res) => {
  res.render('admin/producto-form', { producto: null });
};

export const mostrarFormularioEdicion = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.redirect('/admin/productos');
  res.render('admin/producto-form', { producto });
};
