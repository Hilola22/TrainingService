const Joi = require("joi");

const adminSchema = Joi.object({
  full_name: Joi.string().max(50).required(),
  phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
  email: Joi.string().email().lowercase().max(50).required(),
  password: Joi.string().max(200),
  is_active: Joi.boolean(),
});

module.exports = { adminSchema };
