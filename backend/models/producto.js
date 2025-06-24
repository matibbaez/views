'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      // Asociación con DetalleVenta
      this.hasMany(models.DetalleVenta, { foreignKey: 'productoId' });
    }
  }

  Producto.init({
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    artista: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    imagen: DataTypes.STRING,
    fechaShow: DataTypes.DATE,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Producto',
  });

  return Producto;
};
