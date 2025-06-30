import { Venta, DetalleVenta } from '../models/index.js';

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
