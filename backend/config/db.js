import { Sequelize } from 'sequelize';
import envs from './envs.js';

const sequelize = new Sequelize({
  dialect: envs.db.dialect,
  storage: envs.db.storage,
  logging: envs.db.logging,
});

export default sequelize;
