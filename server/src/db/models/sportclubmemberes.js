"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SportClubMemberes extends Model {
    static associate(models) {
      SportClubMemberes.belongsTo(models.SportClub, {
        foreignKey: "sportClub_id",
        as: "sportClub",
      });
      SportClubMemberes.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }

    static validate(data, isUpdate = false) {
      if (!data) {
        return {
          isValid: false,
          error: "Данные не пришли",
        };
      }

      // Для обновления проверяем только наличие данных
      if (isUpdate) {
        if (Object.keys(data).length === 0) {
          return {
            isValid: false,
            error: "Данные для обновления не пришли",
          };
        }
        return { isValid: true, error: null };
      }

      // Для создания проверяем обязательные поля
      const { sportClub_id, user_id } = data;

      if (!sportClub_id || typeof sportClub_id !== "number") {
        return {
          isValid: false,
          error: "Спорт клуб не выбран",
        };
      }

      if (!user_id || typeof user_id !== "number") {
        return {
          isValid: false,
          error: "Пользователь не выбран",
        };
      }

      return { isValid: true, error: null };
    }
  }
  SportClubMemberes.init(
    {
      sportClub_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      access: DataTypes.BOOLEAN,  
    },
    {
      sequelize,
      modelName: "SportClubMemberes",
    }
  );
  return SportClubMemberes;
};
