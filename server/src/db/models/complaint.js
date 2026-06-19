"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      Complaint.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Complaint.belongsTo(models.Event, { foreignKey: "eventId", as: "event" });
    }
  }
  Complaint.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      type_Of_complaint: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Complaint",
    }
  );
  return Complaint;
};
