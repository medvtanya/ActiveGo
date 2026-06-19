"use strict";
const path = require("path");
const { Model } = require("sequelize");
const fs = require("fs").promises;

module.exports = (sequelize, DataTypes) => {
  class SportClub extends Model {
    static associate(models) {
      SportClub.belongsTo(models.Sport, {
        foreignKey: "sport_id",
        as: "sport",
      });
      SportClub.belongsTo(models.City, { foreignKey: "city_id", as: "city" });
      SportClub.belongsTo(models.User, { foreignKey: "owner_id", as: "owner" });
      SportClub.hasMany(models.SportClubMemberes, {
        foreignKey: "sportClub_id",
        as: "members",
      });
      SportClub.hasMany(models.Chat, {
        foreignKey: "sportClubId",
        as: "chats",
      });
    }

    static validate(data) {
      if (!data) {
        return {
          isValid: false,
          error: "Данные не пришли",
        };
      }

      const {
        title,
        sport_id,
        openCommunity,
        city_id,
        owner_id,
        photo,
        content,
      } = data;

      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return {
          isValid: false,
          error: "Название не может быть пустым",
        };
      }

      if (
        !content ||
        typeof content !== "string" ||
        content.trim().length === 0
      ) {
        return {
          isValid: false,
          error: "Описание клуба не может быть пустым",
        };
      }

      if (!sport_id || typeof sport_id !== "number") {
        return {
          isValid: false,
          error: "Спорт не выбран",
        };
      }

      if (openCommunity && typeof openCommunity !== "boolean") {
        return {
          isValid: false,
          error: "Открытость сообщества должна быть булевым значением",
        };
      }

      if (!city_id || typeof city_id !== "number") {
        return {
          isValid: false,
          error: "Город не выбран",
        };
      }

      if (!owner_id || typeof owner_id !== "number") {
        return {
          isValid: false,
          error: "Владелец не выбран",
        };
      }

      if (photo && typeof photo !== "string") {
        return {
          isValid: false,
          error: "Формат фото неверный",
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }
  }
  SportClub.init(
    {
      title: DataTypes.STRING,
      sport_id: DataTypes.INTEGER,
      openCommunity: DataTypes.BOOLEAN,
      city_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      owner_id: DataTypes.INTEGER,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SportClub",
      hooks: {
        beforeUpdate: async (sportClub) => {
          // Удаляем старое фото только если есть новое и старое фото существует
          if (sportClub.changed("photo") && sportClub.previous("photo")) {
            try {
              const oldPhoto = path.join(
                __dirname,
                "../../public/images",
                sportClub.previous("photo")
              );
              await fs.access(oldPhoto); // Проверяем существование файла
              await fs.unlink(oldPhoto);
            } catch (error) {
              console.log("Ошибка при удалении старого фото:", error.message);
            }
          }
        },
        afterDestroy: async (sportClub) => {
          // Удаляем фото только если оно существует
          if (sportClub.photo) {
            try {
              const photo = path.join(
                __dirname,
                "../../public/images",
                sportClub.photo
              );
              await fs.access(photo); // Проверяем существование файла
              await fs.unlink(photo);
            } catch (error) {
              console.log("Ошибка при удалении фото в хуке:", error.message);
            }
          }
        },
      },
    }
  );

  return SportClub;
};
