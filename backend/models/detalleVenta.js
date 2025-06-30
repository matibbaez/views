import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class DetalleVenta extends Model {
    static associate(models) {
      this.belongsTo(models.Venta, {
        foreignKey: 'ventaId',
        as: 'venta'
      });

      this.belongsTo(models.Producto, {
        foreignKey: 'productoId',
        as: 'producto'
      });
    }
  }

  DetalleVenta.init({
    ventaId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DetalleVenta',
  });

  return DetalleVenta;
};
