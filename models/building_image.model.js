const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Buildings = require("./buildings.model");

const Building_Image = sequelize.define(
  "building_image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING,
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

Buildings.hasMany(Building_Image);
Building_Image.belongsTo(Buildings)

module.exports = Building_Image;
