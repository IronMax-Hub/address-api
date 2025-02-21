'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('States', [
      { name: 'California', CountryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Texas', CountryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ontario', CountryId: 2, createdAt: new Date(), updatedAt: new Date() },
      // Add more states as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('States', null, {});
  }
}; 