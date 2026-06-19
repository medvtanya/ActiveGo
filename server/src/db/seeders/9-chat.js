"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Chats", [
      {
        userId: 1,
        message: "Привет! Как дела? Готов к тренировке?",
        sportClubId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        message: "Встречаемся в 18:00. Не забудьте форму",
        sportClubId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chats", null, {});
  },
};
