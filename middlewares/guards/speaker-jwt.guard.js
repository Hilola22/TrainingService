const { sendErrorResponse } = require("../../helpers/send.error.response");
const { speakerJwtService } = require("../../services/jwt.service");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).send({ message: "Unauthorized speaker" });
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer token not found!" });
    }
    const decodedPayload = await speakerJwtService.verifyAccessToken(token);
    req.speaker = decodedPayload;
    next();
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};
