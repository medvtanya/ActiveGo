'use strict';
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
      User.hasMany(models.Event, { foreignKey: 'userId', as: 'events' });
      User.hasMany(models.Complaint, {
        foreignKey: 'userId',
        as: 'complaints',
      });
      User.hasMany(models.UserSport, {
        foreignKey: 'userId',
        as: 'userSports',
      });
      User.hasMany(models.SportClubMemberes, {
        foreignKey: 'user_id',
        as: 'clubMemberships',
      });
      User.hasMany(models.SportClub, {
        foreignKey: 'owner_id',
        as: 'ownedClubs',
      });
      User.hasMany(models.Chat, { foreignKey: 'userId', as: 'chats' });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true, // теперь не обязателен для Telegram регистрации
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true, // теперь не обязателен
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iphone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: function (value) {
            if (value && value !== '') {
              return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
            }
            return true;
          },
        },
        comment: 'Формат: +7 (918) 355-55-49',
      },
      birth: DataTypes.STRING,
      content: DataTypes.STRING,
      link: DataTypes.STRING,
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/images/default-avatar.png',
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      telegram_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        comment: 'Telegram user id',
      },
      telegram_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/images/default-avatar.png',
        comment: 'Telegram photo url',
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (newUser) => {
          if (newUser.password) {
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password') && user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
          }
        },
        afterCreate: (newUser) => {
          const rawUser = newUser.get();
          return rawUser;
        },
        afterDestroy: async (user) => {
          const fs = require('fs');
          const path = require('path');

          if (user.photo && !user.photo.includes('default')) {
            try {
              const photoPath = path.join(
                __dirname,
                '../../public/images',
                user.photo.replace('/images/', '')
              );
              if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
                console.log(
                  'Удалено фото пользователя при удалении аккаунта:',
                  user.photo
                );
              }
            } catch (error) {
              console.log(
                'Ошибка при удалении фото пользователя:',
                error.message
              );
            }
          }

          if (user.telegram_photo && !user.telegram_photo.includes('default')) {
            try {
              const telegramPhotoPath = path.join(
                __dirname,
                '../../public/images',
                user.telegram_photo.replace('/images/', '')
              );
              if (fs.existsSync(telegramPhotoPath)) {
                fs.unlinkSync(telegramPhotoPath);
                console.log(
                  'Удалено telegram_photo пользователя при удалении аккаунта:',
                  user.telegram_photo
                );
              }
            } catch (error) {
              console.log(
                'Ошибка при удалении telegram_photo пользователя:',
                error.message
              );
            }
          }
        },
      },
    }
  );
  return User;
};
