const { sendErrorResponse } = require("../../helpers/send.error.response");
const { userJwtService } = require("../../services/jwt.service");

module.exports = async(req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).send({ message: "Unzauthorized user" });
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    console.log(token);

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer token not found!" });
    }
    const decodedPayload = await userJwtService.verifyAccessToken(token)
    
    req.user = decodedPayload;
    next();
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};
