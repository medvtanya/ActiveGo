"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Sport, { foreignKey: "sportId", as: "sport" });
      Event.belongsToMany(models.User, {
        through: "EventParticipants",
        as: "participants",
        foreignKey: "eventId",
        otherKey: "userId",
      });
      Event.belongsTo(models.City, { foreignKey: "cityId", as: "city" });
      Event.hasMany(models.Complaint, {
        foreignKey: "eventId",
        as: "complaints",
      });
    }
  }
  Event.init(
    {
      photos: DataTypes.ARRAY(DataTypes.STRING),
      sportId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      content: DataTypes.TEXT,
      member: DataTypes.INTEGER,
      level: DataTypes.ARRAY(DataTypes.STRING),
      date: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      coords: DataTypes.ARRAY(DataTypes.NUMBER),
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
