'use strict';
const fs = require('fs');
const csv = require('csv-parser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const countries = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('./countries.csv')
        .pipe(csv())
        .on('data', (row) => {
          countries.push({
            short: row.short,
            name: row.name,
            common_name: row.common_name,
            iso3: row.iso3,
            num_code: row.num_code,
            phone_code: row.phone_code,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        })
        .on('end', async () => {
          try {
            await queryInterface.bulkInsert('Countries', countries, {});
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Countries', null, {});
  }
}; 