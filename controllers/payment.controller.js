const { sendErrorResponse } = require("../helpers/send.error.response");
const Enrollment = require("../models/enrollment.model");
const Payments = require("../models/payment.model");
const Speaker = require("../models/speaker.model");
const Training = require("../models/training.model");
const User = require("../models/user.model");

const createPayment = async (req, res) => {
  try {
    const { enrollmentId, payment_date, payment_method, payment_status } =
      req.body;

    const newPayment = await Payments.create({
      enrollmentId,
      payment_date,
      payment_method,
      payment_status,
    });

    res.status(201).send({ message: "New payment created", data: newPayment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const cretificates = await Payments.findAll({
      include: [
        {
          model: Enrollment,
          attributes: [
            "id",
            "adminId",
            "userId",
            "trainingId",
            "enrollment_date",
          ],
        },
      ],
    });
    res.status(200).send({
      data: cretificates,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payments.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    res.status(200).send({ data: payment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { enrollmentId, payment_date, payment_method, payment_status } =
      req.body;
    const payment = await Payments.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    await payment.update({
      enrollmentId,
      payment_date,
      payment_method,
      payment_status,
    });

    const updatedPayment = await Payments.findByPk(id);

    res.status(200).send({
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payments.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }

    await payment.destroy();

    res.status(200).send({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

//========Aqlli so'rov===============
const getClientPayment = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payments.findAll({
      include: [
        {
          model: Enrollment,
          where: { userId },
          include: [
            {
              model: Training,
              attributes: ["id", "title"],
              include: [
                {
                  model: Speaker,
                  attributes: ["id", "full_name", "email"],
                },
              ],
            },
            {
              model: User,
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
    });

    res.status(200).send({ data: payments });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createPayment,
  findAll,
  findOne,
  update,
  remove,
  getClientPayment,
};
