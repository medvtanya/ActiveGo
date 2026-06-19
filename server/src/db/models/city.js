"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.hasMany(models.User, { foreignKey: "cityId", as: "users" });
      City.hasMany(models.Event, { foreignKey: "cityId", as: "events" });
      City.hasMany(models.SportClub, {
        foreignKey: "city_id",
        as: "sportClubs",
      });
    }
  }
  City.init(
    {
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "City",
    }
  );
  return City;
};
