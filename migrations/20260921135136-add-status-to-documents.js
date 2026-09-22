'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Documents', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'uploaded'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Documents', 'status');
  }
};
