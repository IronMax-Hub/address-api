'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', [
      { name: 'Los Angeles', pincode: '90001', StateId: 1, lat: 34.0522, lng: -118.2437, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Houston', pincode: '77001', StateId: 2, lat: 29.7604, lng: -95.3698, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Toronto', pincode: 'M5H', StateId: 3, lat: 43.65107, lng: -79.347015, createdAt: new Date(), updatedAt: new Date() },
      // Add more cities as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', null, {});
  }
}; 