import { DetalleVenta, Producto, Venta } from '../models/index.js';
import { Sequelize } from 'sequelize';

export const obtenerProductosMasVendidos = async () => {
  const resultados = await DetalleVenta.findAll({
    attributes: [
      'productoId',
      [Sequelize.fn('SUM', Sequelize.col('cantidad')), 'totalVendida']
    ],
    include: [{
      model: Producto,
      as: 'producto'
    }],
    group: ['productoId', 'producto.id'],
    order: [[Sequelize.literal('totalVendida'), 'DESC']],
    limit: 10
  });

  return resultados;
};

export const obtenerVentasMasCaras = async () => {
  const ventas = await Venta.findAll({
    order: [['total', 'DESC']],
    limit: 10
  });

  return ventas;
};

// Función agrupadora para el controller
export const obtenerRegistrosAdmin = async () => {
  const [productosMasVendidos, ventasMasCaras] = await Promise.all([
    obtenerProductosMasVendidos(),
    obtenerVentasMasCaras()
  ]);

  return {
    productosMasVendidos,
    ventasMasCaras
  };
};
