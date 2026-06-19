"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Sports", [
      {
        type: "Футбол",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Баскетбол",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Теннис",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Плавание",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Бег",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Велоспорт",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Волейбол",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Бокс",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Йога",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Гимнастика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Дополнительные 40 видов спорта
      {
        type: "Акробатика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Бадминтон",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Бейсбол",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Биатлон",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Борьба",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Боулинг",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Гандбол",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Гольф",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Гребля",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Дартс",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Дзюдо",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Карате",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Кёрлинг",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Киберспорт",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Крикет",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Лакросс",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Лёгкая атлетика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Лыжные гонки",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Настольный теннис",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Парусный спорт",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Парашютный спорт",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Регби",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Скалолазание",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Скейтбординг",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Сноубординг",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Современное пятиборье",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Стрельба",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Сёрфинг",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Тайский бокс",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Триатлон",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Тхэквондо",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Тяжёлая атлетика",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Фехтование",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Фигурное катание",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Фитнес",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Хоккей",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Шахматы",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Водное поло",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Айкидо",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Sports", null, {});
  },
};
