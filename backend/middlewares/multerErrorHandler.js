export function multerErrorHandler(err, req, res, next) {
  if (err instanceof Error && err.message.startsWith('Solo se permiten imágenes')) {
    return res.status(400).render('admin/producto-form', {
      error: err.message,
      producto: req.producto || null
    });
  }

  // Otros errores de multer, como por tamaño
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).render('admin/producto-form', {
      error: 'La imagen excede el tamaño máximo permitido (2MB)',
      producto: req.producto || null
    });
  }

  next(err); // Otros errores no relacionados con multer
}
