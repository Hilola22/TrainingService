const Joi = require("joi");

const buildingImageSchema = Joi.object({
  buildingId: Joi.number().integer().required().messages({
    "any.required": "buildingId is required for a building image",
  }),
  image_url: Joi.string()
});
module.exports = { buildingImageSchema };
