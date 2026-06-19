"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SportClubMemberes", [
      {
        sportClub_id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        access: true,
      },
      {
        sportClub_id: 1,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        access: true,
      },
      {
        sportClub_id: 2,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        access: true,
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SportClubMemberes", null, {});
  },
};
