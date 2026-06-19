'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const areasPath = path.resolve(__dirname, '../../resources/areas.json');
    const areasData = JSON.parse(fs.readFileSync(areasPath, 'utf-8'));

   
    const cityArr = Array.isArray(areasData.cities) ? areasData.cities : [];
    const citySet = new Set(cityArr.filter(Boolean));
    const cities = Array.from(citySet).map((city) => ({
      city,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (cities.length > 0) {
      const chunkSize = 1000;
      for (let i = 0; i < cities.length; i += chunkSize) {
        const chunk = cities.slice(i, i + chunkSize);
        await queryInterface.bulkInsert('Cities', chunk, {});
      }
    }
  },

  async down(queryInterface) {
    const areasPath = path.resolve(__dirname, '../../resources/areas.json');
    const areasData = JSON.parse(fs.readFileSync(areasPath, 'utf-8'));
    const cityArr = Array.isArray(areasData.cities) ? areasData.cities : [];
    const citySet = new Set(cityArr.filter(Boolean));
    const cityNames = Array.from(citySet);
    if (cityNames.length > 0) {
      await queryInterface.bulkDelete('Cities', { city: cityNames }, {});
    }
  },
};
