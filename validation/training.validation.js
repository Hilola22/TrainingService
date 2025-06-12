const Joi = require("joi");

const trainingSchema = Joi.object({
  title: Joi.string().max(50).required(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  duration: Joi.string().max(100),
  format: Joi.string().valid("online", "offline", "hybrid"),
  total_price: Joi.number().precision(2),
  specialization: Joi.string().max(100),
  status: Joi.string().valid("conducted", "cancelled", "delayed"),
  speakerId: Joi.number().integer().required().messages({
    "any.required": "speakerId is required for a training",
  }),
  buildingsId: Joi.number().integer().optional().messages({
    "any.required": "buildingsId is required for a training",
  }),
});

module.exports = { trainingSchema };
