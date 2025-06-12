const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Enrollment = require("./enrollment.model");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_date: DataTypes.DATE,
    payment_method: DataTypes.ENUM("cash", "card"),
    payment_status: DataTypes.ENUM("paid", "unpaid", "will pay"),
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Payment.hasMany(Enrollment, { foreignKey: "enrollmentId" });
Enrollment.belongsTo(Payment);

module.exports = Payment;
