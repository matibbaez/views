'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.associate = (models) => {
        Producto.belongsToMany(models.Venta, {
          through: models.DetalleVenta,
          foreignKey: 'productoId'
        });
      };
    }
  }
  Producto.init({
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    artista: DataTypes.STRING,
    fechaShow: DataTypes.DATE,
    precio: DataTypes.DECIMAL,
    imagen: DataTypes.STRING,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Producto',
    timestamps: true, // 👈 Esto agrega createdAt y updatedAt automáticamente
  });
  return Producto;
};
