import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      this.hasMany(models.DetalleVenta, { foreignKey: 'productoId', as: 'detalles' });
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
