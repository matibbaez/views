export default function validarProducto(req, res, next) {
  const { nombre, precio, tipo, fechaShow } = req.body;
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

  if (tipo === 'entrada') {
    if (!fechaShow) {
      errores.push('La fecha del show es obligatoria para entradas.');
    } else {
      const fecha = new Date(fechaShow);
      const hoy = new Date();
      hoy.setHours(0,0,0,0);

      if (fecha < hoy) {
        errores.push('La fecha del show no puede ser anterior a hoy.');
      }
    }
  }

  if (errores.length > 0) {
    return res.render('admin/producto-form', {
      producto: { ...req.body, id: null },
      errores
    });
  }

  next();
}
