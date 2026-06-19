"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "SportClubs",
      [
        {
          title: "SportClub1",
          sport_id: 1,
          openCommunity: true,
          content: "Лучший клуб по футболку в городе!!!",
          city_id: 1,
          owner_id: 1,
          photo: "images/event3.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "SportClub2",
          sport_id: 2,
          openCommunity: false,
          content:
            "Обсуждаем важные вопросы касательно мероприятий по баскетболу",
          city_id: 2,
          owner_id: 2,
          photo: "images/event4.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Теннисные энтузиасты",
          sport_id: 3,
          openCommunity: true,
          content:
            "Сообщество любителей большого тенниса. Организуем турниры и совместные тренировки",
          city_id: 218,
          owner_id: 3,
          photo: "images/club3.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Пловцы СПб",
          sport_id: 4,
          openCommunity: true,
          content:
            "Профессиональные спортсмены и любители. Совместные заплывы и обмен опытом",
          city_id: 218,
          owner_id: 4,
          photo: "images/club4.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Беговой клуб 'Скорость'",
          sport_id: 5,
          openCommunity: false,
          content:
            "Закрытое сообщество для подготовки к марафонам. Только по приглашениям",
          city_id: 218,
          owner_id: 1,
          photo: "images/club5.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Велосипедисты Петербурга",
          sport_id: 6,
          openCommunity: true,
          content: "Организуем групповые заезды по городу и за его пределами",
          city_id: 218,
          owner_id: 2,
          photo: "images/club6.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Волейбольная лига",
          sport_id: 7,
          openCommunity: true,
          content:
            "Турниры по пляжному и классическому волейболу. Набор новых команд",
          city_id: 218,
          owner_id: 3,
          photo: "images/club7.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Боксерский клуб 'Удар'",
          sport_id: 8,
          openCommunity: false,
          content:
            "Профессиональная подготовка боксеров. Тренировки с чемпионами",
          city_id: 218,
          owner_id: 4,
          photo: "images/club8.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Йога-сообщество",
          sport_id: 9,
          openCommunity: true,
          content:
            "Регулярные занятия йогой в парках города. Все уровни подготовки",
          city_id: 218,
          owner_id: 2,
          photo: "images/club9.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Гимнастика для всех",
          sport_id: 10,
          openCommunity: true,
          content:
            "Уличные тренировки по спортивной гимнастике. Научим базовым элементам",
          city_id: 218,
          owner_id: 1,
          photo: "images/club10.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SportClubs", null, {});
  },
};
