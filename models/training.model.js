const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Speaker = require("./speaker.model");
const Buildings = require("./buildings.model");

const Training = sequelize.define(
  "trainings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.STRING(100),
    },
    format: {
      type: DataTypes.ENUM("online", "offline", "hybrid"),
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
    },
    specialization: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.ENUM("conducted", "cancelled", "delayed"),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Speaker.hasMany(Training);
Training.belongsTo(Speaker);

Buildings.hasMany(Training);
Training.belongsTo(Buildings);

module.exports = Training;
