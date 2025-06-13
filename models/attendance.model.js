const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Enrollment = require("./enrollment.model");
const Admin = require("./admin.model");

const Attendance = sequelize.define(
  "attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total_participants_count: DataTypes.INTEGER,
    participant_status: DataTypes.ENUM("present", "absent"),
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Enrollment.hasMany(Attendance)
Attendance.belongsTo(Enrollment)

Admin.hasMany(Attendance)
Attendance.belongsTo(Admin)

module.exports = Attendance;
