const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Training = require("./training.model");

const Certificates = sequelize.define(
  "certificates",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    is_completed: DataTypes.BOOLEAN,
    certificate_url: DataTypes.STRING,
    issued_at: DataTypes.DATE,
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

User.hasMany(Certificates)
Certificates.belongsTo(User)

Training.hasMany(Certificates)
Certificates.belongsTo(Training)

module.exports = Certificates;
