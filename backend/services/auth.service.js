import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';

export const autenticarUsuario = async (email, password) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return { error: 'Usuario no encontrado' };
  }

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) {
    return { error: 'Contraseña incorrecta' };
  }

  return { usuario };
};
