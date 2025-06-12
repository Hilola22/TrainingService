const Joi = require("joi");

const attendanceSchema = Joi.object({
  enrollmentId: Joi.number().integer().required().messages({
    "any.required": "enrollmentId is required for attendance",
  }),
  adminId: Joi.number().integer().required().messages({
    "any.required": "adminId is required for attendance",
  }),
  total_participants_count: Joi.number().integer(),
  participant_status: Joi.string().valid("present", "absent"),
});

module.exports = { attendanceSchema };
