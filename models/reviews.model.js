const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Training = require("./training.model");

const Reviews = sequelize.define(
  "reviews",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: DataTypes.INTEGER,
    comment: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Reviews.hasMany(User)
User.belongsTo(Reviews)

Reviews.hasMany(Training)
Training.belongsTo(Reviews)

module.exports = Reviews;
