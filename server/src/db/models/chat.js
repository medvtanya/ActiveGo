"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Chat.belongsTo(models.SportClub, {
        foreignKey: "sportClubId",
        as: "sportClub",
      });
    }
  }
  Chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sportClubId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SportClubs",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Chat",
      timestamps: true,
    }
  );
  return Chat;
};
