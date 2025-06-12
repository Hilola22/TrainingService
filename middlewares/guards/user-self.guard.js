const { sendErrorResponse } = require("../../helpers/send.error.response");

module.exports = (req, res, next) => {
  try {
    console.log(req.user);
    if (req.params.id != req.user.id) {
      return res
        .status(403)
        .send({
          message: "Not allowed user. You can see only personal informations",
        });
    }
    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
