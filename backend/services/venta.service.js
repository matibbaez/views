import { Venta, DetalleVenta, Producto } from '../models/index.js';

export const registrarVenta = async (nombreCliente, productos) => {
  const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  const venta = await Venta.create({
    nombreCliente,
    fecha: new Date(),
    total
  });

  for (const prod of productos) {
    await DetalleVenta.create({
      ventaId: venta.id,
      productoId: prod.id,
      cantidad: prod.cantidad
    });
  }

  return venta;
};

// Obtener ventas paginadas con detalles y productos
export const obtenerVentasPaginadas = async (page = 1, limit = 10) => {
  const count = await Venta.count();
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * limit;

  const ventas = await Venta.findAll({
    include: [{
      model: DetalleVenta,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }]
    }],
    order: [['fecha', 'DESC']],
    limit,
    offset
  });

  return { ventas, totalPages, currentPage };
};
