'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('user123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@metadata.local',
        passwordHash: adminHash,
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        email: 'user@metadata.local',
        passwordHash: passwordHash,
        role: 'user',
        createdAt: now,
        updatedAt: now
      }
    ]);

    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'user@metadata.local' LIMIT 1;`
    );

    if (users.length) {
      await queryInterface.bulkUpdate('Documents', { userId: users[0].id }, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate('Documents', { userId: null }, {});
    await queryInterface.bulkDelete('Users', {
      email: ['admin@metadata.local', 'user@metadata.local']
    });
  }
};
