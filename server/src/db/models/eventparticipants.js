"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventParticipants extends Model {
    static associate(models) {
      // Опционально: можно добавить belongsTo для Event и User
      EventParticipants.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
      EventParticipants.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  EventParticipants.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EventParticipants",
      timestamps: true,
    }
  );
  return EventParticipants;
};
