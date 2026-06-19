'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true, // теперь не обязателен для Telegram регистрации
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iphone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      birth: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '/images/default-avatar.png',
      },
      telegram_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        comment: 'Telegram user id',
      },
      telegram_username: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Telegram username',
      },
      telegram_photo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '/images/default-avatar.png',
        comment: 'Telegram photo url',
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Cities',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
