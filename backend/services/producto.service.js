import { Producto } from '../models/index.js';

export async function getAllProductos({ limit = 10, offset = 0, tipo = null }) {
  const where = { activo: true };
  if (tipo) where.tipo = tipo; // filtro por tipo

  const resultado = await Producto.findAndCountAll({
    where,
    limit,
    offset
  });

  return {
    productos: resultado.rows,
    total: resultado.count
  };
}
