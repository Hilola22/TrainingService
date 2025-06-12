const { sendErrorResponse } = require("../helpers/send.error.response");
const Buildings = require("../models/buildings.model");
const Speaker = require("../models/speaker.model");
const Training = require("../models/training.model");
const { Op } = require("sequelize");
const sequelize = require('sequelize');

const createTraining = async (req, res) => {
  try {
    const {
      title,
      start_date,
      end_date,
      duration,
      format,
      total_price,
      specialization,
      status,
      speakerId, 
      buildingId,
    } = req.body;

    const newTraining = await Training.create({
      title,
      start_date,
      end_date,
      duration,
      format,
      total_price,
      specialization,
      status: status || "conducted",
      speakerId,
      buildingId,
    });

    res.status(201).send({
      message: "Training created successfully",
      data: newTraining,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.findAll({
      include: [
        {
          model: Speaker,
          attributes: ["id", "full_name", "email", "phone_number"],
        },
        {
          model: Buildings,
          attributes: ["building_name", "location", "price_per_hour"]
        },
      ],
    });

    res.status(200).send({
      data: trainings,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;

    const training = await Training.findByPk(id, {
      include: ["speaker"],
    });

    if (!training) {
      return sendErrorResponse({ message: "Training not found" }, res, 404);
    }

    res.status(200).send({
      data: training,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      start_date,
      end_date,
      duration,
      format,
      total_price,
      specialization,
      status,
    } = req.body;

    const training = await Training.findByPk(id);
    if (!training) {
      return sendErrorResponse({ message: "Training not found" }, res, 404);
    }

    await training.update({
      title,
      start_date,
      end_date,
      duration,
      format,
      total_price,
      specialization,
      status,
    });

    const updatedTraining = await Training.findByPk(id, {
      include: ["speaker"],
    });

    res.status(200).send({
      message: "Training updated successfully",
      data: updatedTraining,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;

    const training = await Training.findByPk(id);
    if (!training) {
      return sendErrorResponse({ message: "Training not found" }, res, 404);
    }

    await training.destroy();

    res.status(200).send({
      message: "Training deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

//===============Aqlli so'rov=======================
const trainingServices = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const services = await Training.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      attributes: ["title", "start_date", "end_date", "format", "total_price"],
      include: [
        {
          model: Speaker,
          attributes: ["id","full_name", "phone_number", "email"],
        },
      ],
    });
    res.status(200).send({ data: services });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getTopSpeakersByTraining = async (req, res) => {
  try {
    const { title } = req.body;

    const topSpeakers = await Training.findAll({
      attributes: [
        "speakerId",
        [sequelize.fn("COUNT", sequelize.col("speakerId")), "trainings_count"],
      ],
      include: [
        {
          model: Speaker,
          as: "speaker",
          attributes: ["id", "full_name", "email"],
        },
      ],
      group: [
        "trainings.speakerId",
        "speaker.id",
        "speaker.full_name",
        "speaker.email",
      ],
      order: [[sequelize.literal("trainings_count"), "DESC"]],
      raw: true,
    });

    res.status(200).send({ data: topSpeakers });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  trainingServices,
  getTopSpeakersByTraining,
};
