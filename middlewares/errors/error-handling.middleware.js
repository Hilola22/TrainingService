const ApiError = require("../../error/ApiError");
const logger = require("../../services/logger.service");

module.exports = function (error, req, res, next) {
  console.log(error);
  logger.error(error);
  if (error instanceof ApiError) {
    return res.status(error.status).send({ message: error.message });
  }

  if (error instanceof SyntaxError) {
    return res.status(400).send({ message: error.message });
  }

  return res.status(500).send({ message: "Nazarda tutilmagan xatolik" });
};
