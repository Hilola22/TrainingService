const Joi = require("joi");

const paymentSchema = Joi.object({
  enrollmentId: Joi.number().integer().required().messages({
    "any.required": "enrollmentId is required for a payment",
  }),
  payment_date: Joi.date(),
  payment_method: Joi.string().valid("cash", "card"),
  payment_status: Joi.string().valid("paid", "unpaid", "will pay"),
});

module.exports = { paymentSchema };
