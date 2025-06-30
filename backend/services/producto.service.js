import { Producto } from '../models/index.js';

export async function getAllProductos() {
  return await Producto.findAll({ where: { activo: true } });
}
