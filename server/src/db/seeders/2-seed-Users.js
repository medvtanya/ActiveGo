"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Иван",
          lastName: "Иванов",
          userName: "ivanov",
          email: "ivanov@example.com",
          password: await bcrypt.hash("qwertQWERT123!!!", 10),
          iphone: "+7 (918) 355-55-49",
          birth: "1990-01-01",
          content: "Тестовый пользователь",
          link: "https://example.com",
          photo: "https://example.com/photo.jpg",
          isAdmin: false,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Петр",
          lastName: "Петров",
          userName: "petrov",
          email: "petrov@example.com",
          password: await bcrypt.hash("qwe^rtQWERT123!!!", 10),
          iphone: "+7 (927) 123-45-67",
          birth: "1992-02-02",
          content: "Еще один пользователь",
          link: "https://example.com",
          photo: "https://example.com/photo2.jpg",
          isAdmin: true,
          cityId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Иван",
          lastName: "Смирнов",
          userName: "smirnov",
          email: "smirnov@example.com",
          password: await bcrypt.hash("qwertQWERT123!!!", 10),
          iphone: "+7 (918) 355-55-48",
          birth: "1990-01-08",
          content: "Тестовый пользователь",
          link: "https://example.com",
          photo: "https://example.com/photo.jpg",
          isAdmin: false,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Валя",
          lastName: "Смирнова",
          userName: "smirnova",
          email: "smirnova@example.com",
          password: await bcrypt.hash("qwertQWERT123!!!", 10),
          iphone: "+7 (918) 355-55-42",
          birth: "1990-01-05",
          content: "Тестовый пользователь",
          link: "https://example.com",
          photo: "https://example.com/photo.jpg",
          isAdmin: false,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
