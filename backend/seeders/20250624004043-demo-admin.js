'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Usuarios', [{
      nombre: 'Administrador Demo',
      email: 'admin@demo.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', { email: 'admin@demo.com' }, {});
  }
};
