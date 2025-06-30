// config/envs.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'defaultsecret',
  db: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.DB_LOGGING === 'true'
  }
};

