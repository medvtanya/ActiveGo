"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("EventParticipants", [
      {
        eventId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 1,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("EventParticipants", null, {});
  },
};
