'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      // Asociación con DetalleVenta
      this.hasMany(models.DetalleVenta, { foreignKey: 'ventaId', as: 'detalles' });
    }
  }

  Venta.init({
    nombreCliente: DataTypes.STRING,
    fecha: DataTypes.DATE,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Venta',
  });

  return Venta;
};
