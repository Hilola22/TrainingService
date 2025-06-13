const { sendErrorResponse } = require("../../helpers/send.error.response");

module.exports = (req, res, next) => {
  try {
    console.log(req.admin.id);
    if (req.params.id != req.admin.id) {
      return res.status(403).send({
        message: "Not allowed. You can only manage your own account",
      });
    }
    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
