const Joi = require("joi");

const certificatesSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    "any.required": "userId is required for a certificate",
    "number.base": "userId must be a number",
  }),
  trainingId: Joi.number().integer().required().messages({
    "any.required": "trainingId is required for a certificate",
    "number.base": "trainingId must be a number",
  }),
  is_completed: Joi.boolean(),
  certificate_url: Joi.string(),
  issued_at: Joi.date(),
});

module.exports = { certificatesSchema };
