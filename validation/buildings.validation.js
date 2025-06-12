const Joi = require("joi");

const buildingsSchema = Joi.object({
  building_name: Joi.string().max(50),
  floor: Joi.number().integer(),
  room: Joi.string().max(100),
  price_per_hour: Joi.number().precision(2),
  location: Joi.string(),
  description: Joi.string(),
});

module.exports = { buildingsSchema };
