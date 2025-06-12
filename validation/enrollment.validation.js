const Joi = require("joi");

const enrollmentSchema = Joi.object({
  userId: Joi.number().integer(),
  adminId: Joi.number().integer(),
  trainingId: Joi.number().integer(),
  status: Joi.string(),
  enrollment_date: Joi.date(),
})
  .or("userId", "adminId", "trainingId")
  .messages({
    "object.missing":
      "At least one of userId, adminId, or trainingId is required for enrollment",
  });

module.exports = { enrollmentSchema };
