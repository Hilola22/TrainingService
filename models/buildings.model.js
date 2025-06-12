const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Buildings = sequelize.define(
  "buildings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    building_name: {
      type: DataTypes.STRING(50),
    },
    floor: DataTypes.INTEGER,
    room: DataTypes.STRING(100),
    price_per_hour: DataTypes.DECIMAL(15, 2),
    location: DataTypes.STRING,
    description: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Buildings;
