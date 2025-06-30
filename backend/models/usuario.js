import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // No hay relaciones por ahora
    }
  }

  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });

  Usuario.beforeCreate(async (usuario) => {
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
  });

  return Usuario;
};
