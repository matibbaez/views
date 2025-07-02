import { Producto } from '../models/index.js';

export const crearProducto = async (req, res) => {
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
};

export const actualizarProducto = async (req, res) => {
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
};
