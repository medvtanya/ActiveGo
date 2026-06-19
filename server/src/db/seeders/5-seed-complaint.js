"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Complaints", [
      {
        userId: 1,
        eventId: 1,
        content:
          "Этот матч организовал мой бывший, я хочу чтобы вы убрали это. Он не должен веселиться!!",
        type_Of_complaint: [
          "оскорбительный контент",
          "ненависть и преследование",
          "опасные действия и челленджи",
          "дезинформация",
          "мошенничество и обман",
          "насилие, унижение и криминальная эксплуатация",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        eventId: 2,
        content: "Неприемлемый контент в описании события! Уберите маты!!",
        type_Of_complaint: [
          "оскорбительный контент",
          "ненависть и преследование",
          "опасные действия и челленджи",
          "дезинформация",
          "мошенничество и обман",
          "насилие, унижение и криминальная эксплуатация",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Complaints", null, {});
  },
};
