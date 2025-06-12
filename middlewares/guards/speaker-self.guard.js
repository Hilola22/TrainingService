const { sendErrorResponse } = require("../../helpers/send.error.response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id != req.speaker.id) {
      return res.status(403).send({
        message: "Not allowed. You can only manage your own trainings",
      });
    }
    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
