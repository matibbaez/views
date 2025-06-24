'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venta.associate = (models) => {
        Venta.belongsToMany(models.Producto, {
          through: models.DetalleVenta,
          foreignKey: 'ventaId'
        });
      };
    }
  }
  Venta.init({
    nombreCliente: DataTypes.STRING,
    fecha: DataTypes.DATE,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Venta',
  });
  return Venta;
};