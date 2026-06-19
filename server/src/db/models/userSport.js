"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSport extends Model {
    static associate(models) {
      UserSport.belongsTo(models.Sport, { foreignKey: "sportId", as: "sport" });
      UserSport.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }
  UserSport.init(
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
      sportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Sports",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UserSport",
      timestamps: false,
    }
  );
  return UserSport;
};
