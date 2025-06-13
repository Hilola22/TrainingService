const { sendErrorResponse } = require("../helpers/send.error.response");
const Enrollments = require("../models/enrollment.model");
const Admin = require("../models/admin.model");
const Training = require("../models/training.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

const createEnrollment = async (req, res) => {
  try {
    const { adminId, userId, trainingId, enrollment_date, status } = req.body;

    const newEnrollment = await Enrollments.create(
      {
        adminId,
        userId,
        trainingId,
        enrollment_date,
        status,
      },
      {
        fields: [
          "adminId",
          "userId",
          "trainingId",
          "enrollment_date",
          "status",
        ],
      }
    );

    const cleanEnrollment = await Enrollments.findByPk(newEnrollment.id, {
      attributes: [
        "id",
        "adminId",
        "userId",
        "trainingId",
        "enrollment_date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Training,
          attributes: ["id", "title"],
        },
        {
          model: Admin,
          attributes: ["id", "full_name"],
        },
      ],
    });

    res.status(201).send({
      message: "New enrollment created",
      data: cleanEnrollment,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const enrollments = await Enrollments.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email", "phone_number"],
        },
        {
          model: Training,
          attributes: [
            "id",
            "title",
            "start_date",
            "end_date",
            "total_price",
            "status",
          ],
        },
        {
          model: Admin,
          attributes: ["id", "full_name", "email", "phone_number"],
        },
      ],
      attributes: ["id", "enrollment_date", "status"],
    });
    res.status(200).send({
      data: enrollments,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollments.findByPk(id);
    if (!enrollment) {
      return res.status(404).send({ message: "Enrollment not found" });
    }
    res.status(200).send({ data: enrollment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, userId, trainingId, enrollment_date, status } = req.body;
    const enrollment = await Enrollments.findByPk(id);
    if (!enrollment) {
      return res.status(404).send({ message: "Training not found" });
    }
    await enrollment.update(
      {
        adminId,
        userId,
        trainingId,
        enrollment_date,
        status,
      },
      {
        where: { id },
      }
    );

    const updatedEnrollment = await Enrollments.findByPk(id, {
      attributes: [
        "id",
        "userId",
        "trainingId",
        "adminId",
        "enrollment_date",
        "status",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "full_name"],
        },
        {
          model: Training,
          attributes: ["id", "title", "start_date", "end_date"],
        },
        {
          model: Admin,
          attributes: ["id", "full_name"],
        },
      ],
    });

    res.status(200).send({
      message: "Enrollment updated successfully",
      data: updatedEnrollment,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollments.findByPk(id);
    if (!enrollment) {
      return res.status(404).send({ message: "Enrollment not found" });
    }

    await enrollment.destroy();

    res.status(200).send({
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

//===============Aqlli so'rov=======================
const TrainingUsedUser = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const participants = await Enrollments.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Training,
          where: {
            start_date: { [Op.gte]: new Date(start_date) },
            end_date: { [Op.lte]: new Date(end_date) },
          },
          attributes: ["id", "title", "start_date", "end_date"],
        },
      ],
    });
    res.status(200).send({ data: participants });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const StatusCancelled = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const cancelledUsers = await Enrollments.findAll({
      attributes: ["enrollment_date", "status", "updatedAt", "createdAt"],
      where: {
        status: "cancelled",
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });
    res.status(200).send({ data: cancelledUsers });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createEnrollment,
  findAll,
  findOne,
  update,
  remove,
  TrainingUsedUser,
  StatusCancelled,
};
