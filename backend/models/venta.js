import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      this.hasMany(models.DetalleVenta, {
        foreignKey: 'ventaId',
        as: 'detalles'
      });
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
