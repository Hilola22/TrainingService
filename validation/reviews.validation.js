const Joi = require("joi");

const reviewsSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    "any.required": "userId is required for a review",
  }),
  trainingId: Joi.number().integer().required().messages({
    "any.required": "trainingId is required for a review",
  }),
  rating: Joi.number(),
  comment: Joi.string(),
});

module.exports = { reviewsSchema };
