const { sendErrorResponse } = require("../helpers/send.error.response");
const Attendances = require("../models/attendance.model");
const logger = require("../services/logger.service");
const { attendanceSchema } = require("../validation/attendance.validation");
const Enrollment = require("../models/enrollment.model");
const Admin = require("../models/admin.model");

const createAttendance = async (req, res) => {
  try {
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
      logger.error(
        `Validation error in createAttendance: ${error.details[0].message}`
      );
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { enrollmentId, adminId, total_participants_count, participant_status } = req.body;

    const newAttendance = await Attendances.create({
      enrollmentId,
      adminId,
      total_participants_count,
      participant_status
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
          model: Admin,
          attributes: ["id", "full_name", "email", "phone_number"],
        },
        {
          model: Enrollment,
          attributes: [
            "id",
            "userId",
            "enrollment_date",
            "trainingId"
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
          model: Admin,
          attributes: ["id", "full_name", "email", "phone_number"],
        },
        {
          model: Enrollment,
          attributes: ["id", "userId", "enrollment_date", "trainingId"],
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
    const {
      enrollmentId,
      adminId,
      total_participants_count,
      participant_status,
    } = req.body;
    const attendance = await Attendances.findByPk(id);
    if (!attendance) {
      return res.status(404).send({ message: "Attendance not found" });
    }
    await attendance.update(
      {
        enrollmentId,
        adminId,
        total_participants_count,
        participant_status,
      },
      {
        where: { id },
      }
    );
    const updatedAttendance = await Attendances.findByPk(id, {
      include: [{ model: Admin }, { model: Enrollment }],
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
