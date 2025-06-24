'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // define association here
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

  // Hook que encripta la contraseña antes de crear
  Usuario.beforeCreate(async (usuario) => {
    const bcrypt = require('bcryptjs'); 
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
  });

  return Usuario;
};
