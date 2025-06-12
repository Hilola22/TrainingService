const Joi = require("joi");

const userSchema = Joi.object({
  full_name: Joi.string().max(50).required(),
  phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
  email: Joi.string().email().max(50).required().lowercase(),
  password: Joi.string(),
  activation_link: Joi.string(),
  is_active: Joi.boolean(),

});

module.exports = { userSchema };
