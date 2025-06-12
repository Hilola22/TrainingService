const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });

    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

const adminJwtService = new JwtService(
  config.get("accessKeyAdmin"),
  config.get("refreshKeyAdmin"),
  config.get("accessTimeAdmin"),
  config.get("refreshTimeAdmin")
);

const userJwtService = new JwtService(
  config.get("accessKeyUser"),
  config.get("refreshKeyUser"),
  config.get("accessTimeUser"),
  config.get("refreshTimeUser")
);

const speakerJwtService = new JwtService(
  config.get("accessKeySpeaker"),
  config.get("refreshKeySpeaker"),
  config.get("accessTimeSpeaker"),
  config.get("refreshTimeSpeaker")
);

module.exports = {
  speakerJwtService,
  adminJwtService,
  userJwtService
};
