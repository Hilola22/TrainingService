const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Admin = require("./admin.model");
const Training = require("./training.model");

const Enrollment = sequelize.define(
  "enrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    enrollment_date: DataTypes.DATE,
    status: DataTypes.STRING(20),
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Enrollment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Enrollment, { foreignKey: "userId" });

Admin.hasMany(Enrollment, { foreignKey: "adminId" });
Enrollment.belongsTo(Admin, { foreignKey: "adminId" });

Training.hasMany(Enrollment, { foreignKey: "trainingId" });
Enrollment.belongsTo(Training, { foreignKey: "trainingId" });

module.exports = Enrollment;
