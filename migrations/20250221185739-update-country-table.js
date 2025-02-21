'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Countries', 'short', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Countries', 'common_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Countries', 'iso3', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Countries', 'num_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Countries', 'phone_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Countries', 'short');
    await queryInterface.removeColumn('Countries', 'common_name');
    await queryInterface.removeColumn('Countries', 'iso3');
    await queryInterface.removeColumn('Countries', 'num_code');
    await queryInterface.removeColumn('Countries', 'phone_code');
  }
};