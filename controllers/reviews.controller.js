const { sendErrorResponse } = require("../helpers/send.error.response");
const Reviews = require("../models/reviews.model");
const User = require("../models/user.model");
const Training = require("../models/training.model");
const logger = require("../services/logger.service");
const { reviewsSchema } = require("../validation/reviews.validation");

const addReview = async (req, res) => {
  try {
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
      logger.error(
        `Validation error in addReview: ${error.details[0].message}`
      );
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { userId, trainingId, rating, comment } = req.body;

    const newReview = await Reviews.create({
      userId,
      trainingId,
      rating,
      comment,
    });

    res.status(201).send({ message: "New review added", data: newReview });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const reviews = await Reviews.findAll({
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
      data: reviews,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Reviews.findByPk(id);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    res.status(200).send({ data: review });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, trainingId, rating, comment } = req.body;
    const review = await Reviews.findByPk(id);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    await review.update({
      userId,
      trainingId,
      rating,
      comment,
    });

    const updatedReview = await Reviews.findByPk(id, {
      include: ["User", "Training"],
    });

    res.status(200).send({
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findByPk(id);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    await review.destroy();

    res.status(200).send({
      message: "Review deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  addReview,
  findAll,
  findOne,
  update,
  remove,
};
