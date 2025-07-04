import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
import sequelize from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// Para no tener que importar y configurar manualmente cada modelo Sequelize:
// - Importa cada modelo y lo inicializa con la conexión Sequelize.
// - Automatizar el registro y la gestión de modelos Sequelize.
// - Define relaciones entre modelos associate().

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js')
  );

for (const file of modelFiles) {
  const modelURL = pathToFileURL(path.join(__dirname, file)).href;
  const { default: defineModel } = await import(modelURL);
  const model = defineModel(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

export const Usuario = db.Usuario;
export const Producto = db.Producto;
export const Venta = db.Venta;
export const DetalleVenta = db.DetalleVenta;
export const sequelizeInstance = sequelize;
export const SequelizeInstance = Sequelize;

