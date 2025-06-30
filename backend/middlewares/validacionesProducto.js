export default function validarProducto(req, res, next) {
  const { nombre, precio, tipo } = req.body;
  const errores = [];

  if (!nombre || nombre.trim().length < 2) {
    errores.push('El nombre del producto es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!precio || isNaN(precio) || precio <= 0) {
    errores.push('El precio debe ser un número válido mayor a 0.');
  }

  if (!['album', 'entrada'].includes(tipo)) {
    errores.push('El tipo debe ser "album" o "entrada".');
  }

  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  next();
}
