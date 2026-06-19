"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    static associate(models) {
      Sport.hasMany(models.UserSport, {
        foreignKey: "sportId",
        as: "userSports",
      });
      Sport.hasMany(models.Event, { foreignKey: "sportId", as: "events" });
      Sport.hasMany(models.SportClub, {
        foreignKey: "sport_id",
        as: "sportClubs",
      });
    }
  }
  Sport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Sport",
      timestamps: false,
    }
  );
  return Sport;
};
