const { sendErrorResponse } = require("../helpers/send.error.response");
const Attendances = require("../models/attendance.model");
const User = require("../models/user.model");
const Training = require("../models/training.model");
const logger = require("../services/logger.service");
const { attendanceSchema } = require("../validation/attendance.validation");

const createAttendance = async (req, res) => {
  try {
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
      logger.error(
        `Validation error in createAttendance: ${error.details[0].message}`
      );
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { is_completed, userId, trainingId, attendance_url } = req.body;

    const newAttendance = await Attendances.create({
      is_completed,
      userId,
      trainingId,
      attendance_url,
    });

    res
      .status(201)
      .send({ message: "New attendance created", data: newAttendance });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const attendances = await Attendances.findAll({
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
      ],
    });
    res.status(200).send({
      data: attendances,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendances.findByPk(id, {
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
      ],
    });
    
    if (!attendance) {
      return res.status(404).send({ message: "Attendance not found" });
    }
    res.status(200).send({ data: attendance });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed, userId, trainingId, attendance_url } = req.body;
    const attendance = await Attendances.findByPk(id);
    if (!attendance) {
      return res.status(404).send({ message: "Attendance not found" });
    }
    await attendance.update({
      is_completed,
      userId,
      trainingId,
      attendance_url,
    });
    const updatedAttendance = await Attendances.findByPk(id, {
      include: [{ model: User }, { model: Training }],
    });
    return res.status(200).send({
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    return sendErrorResponse(error, res, 400);
  }
};


const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendances.findByPk(id);
    if (!attendance) {
      return res.status(404).send({ message: "Attendance not found" });
    }

    await attendance.destroy();

    res.status(200).send({
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createAttendance,
  findAll,
  findOne,
  update,
  remove,
};
