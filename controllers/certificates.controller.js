const { sendErrorResponse } = require("../helpers/send.error.response");
const Certificates = require("../models/certiificates.model");
const Training = require("../models/training.model");
const User = require("../models/user.model");
const logger = require("../services/logger.service");
const { certificatesSchema } = require("../validation/certiificates.validation");

const createCertificate = async (req, res) => {
  try {
    const { error } = certificatesSchema.validate(req.body);
    if (error) {
      logger.error(
        `Validation error in createCertificate: ${error.details[0].message}`
      );
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { is_completed, userId, trainingId, certificate_url } = req.body;
    if (!is_completed) {
      return res
        .status(400)
        .send({ message: "You haven't finished the training yet." });
    }

    const newCertificate = await Certificates.create({
      is_completed,
      userId,
      trainingId,
      certificate_url,
    });

    res
      .status(201)
      .send({ message: "New certificate created", data: newCertificate });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const cretificates = await Certificates.findAll({
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
      data: cretificates,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificates.findByPk(id);
    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found" });
    }
    res.status(200).send({ data: certificate });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed, userId, trainingId, certificate_url } = req.body;
    const certificate = await Certificates.findByPk(id);
    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found" });
    }
    await certificate.update(
      {
        is_completed,
        userId,
        trainingId,
        certificate_url,
      },
      {
        where: { id },
      }
    );

    const updatedCertificate = await Certificates.findByPk(id, {
      include: ["User", "Training"],
    });

    res.status(200).send({
      message: "Certificate updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificates.findByPk(id);
    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found" });
    }

    await certificate.destroy();

    res.status(200).send({
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createCertificate,
  findAll,
  findOne,
  update,
  remove,
};
