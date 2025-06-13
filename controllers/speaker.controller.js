const { sendErrorResponse } = require("../helpers/send.error.response");
const Speaker = require("../models/speaker.model");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const { speakerJwtService } = require("../services/jwt.service");
const { speakerSchema } = require("../validation/speaker.validation");
const mailService = require("../services/mail.service");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const speaker = await Speaker.findOne({ email });

    if (!speaker) {
      return sendErrorResponse({ message: "Speaker not found" }, res, 401);
    }

    let hashPassword = await bcrypt.compare(password, speaker.hashed_password);

    if (!hashPassword) {
      return sendErrorResponse(
        { message: "Email or password incorrect" },
        res,
        400
      );
    }
    const payload = {
      id: speaker.id,
      email: speaker.email,
      is_active: speaker.is_active,
    };

    const tokens = speakerJwtService.generateTokens(payload);

    speaker.refresh_token = tokens.refreshToken;
    await speaker.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_speaker"),
    });

    res.status(200).send({
      message: "Welcome to the system",
      id: speaker.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logoutSpeaker = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found in cookies",
      });
    }

    const speaker = await Speaker.findOne({ refresh_token: refreshToken });

    if (!speaker) {
      return res.status(404).json({
        message: "Speaker not found with provided refresh token",
      });
    }

    speaker.refresh_token = "";
    await speaker.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Speaker logged out successfully",
    });
  } catch (error) {
    return sendErrorResponse(error, res, 500);
  }
};

const refreshSpeaker = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Refresh token not found in Cookies" },
        res,
        400
      );
    }

    await speakerJwtService.verifyRefreshToken(refreshToken);

    const speaker = await Speaker.findOne({ refresh_token: refreshToken });
    if (!speaker) {
      return sendErrorResponse(
        { message: "Refresh token not found" },
        res,
        400
      );
    }

    const payload = {
      id: speaker._id,
      email: speaker.email,
    };

    const tokens = speakerJwtService.generateTokens(payload);
    speaker.refresh_token = tokens.refreshToken;
    await speaker.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_speaker"),
    });

    return res.status(201).send({
      message: "Tokens updated successfully",
      id: speaker._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const speakerActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const speaker = await Speaker.findOne({ activation_link: link });

    if (!speaker) {
      return sendErrorResponse({ message: "Speaker link incorrect" }, res, 400);
    }

    if (speaker.is_active) {
      return sendErrorResponse(
        { message: "This speaker link was activated before" },
        res,
        400
      );
    }

    speaker.is_active = true;
    await speaker.save();
    res.send({
      message: "Speaker link activated successfully",
      isActive: speaker.is_active,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const addSpeaker = async (req, res) => {
  try {
    const { error } = speakerSchema.validate(req.body);
    if (error) {
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }

    const { email, password, full_name, phone_number } = req.body;

    const existingSpeaker = await Speaker.findOne({ where: { email } });
    if (existingSpeaker) {
      return sendErrorResponse(
        { message: "Speaker with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    const newSpeaker = await Speaker.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      activation_link,
      is_active: true,
    });

    res.status(201).send({
      message: "New speaker added successfully!",
      speaker: {
        id: newSpeaker.id,
        email: newSpeaker.email,
        full_name: newSpeaker.full_name,
        phone_number: newSpeaker.phone_number,
        is_active: newSpeaker.is_active,
      },
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};


const register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;

    const existingSpeaker = await Speaker.findOne({ where: { email } });
    if (existingSpeaker) {
      return sendErrorResponse(
        { message: "Speaker with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    const newSpeaker = await Speaker.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      activation_link,
      is_active: false,
    });

    const activationUrl = `${config.get(
      "api_url"
    )}/api/speakers/activate/${activation_link}`;
    await mailService.sendMail(email, activationUrl);

    const payload = {
      id: newSpeaker.id,
      email: newSpeaker.email,
      is_active: newSpeaker.is_active,
    };

    const tokens = speakerJwtService.generateTokens(payload);
    newSpeaker.refresh_token = tokens.refreshToken;
    await newSpeaker.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_speaker"),
    });

    const speakerResponse = {
      id: newSpeaker.id,
      email: newSpeaker.email,
      full_name: newSpeaker.full_name,
      phone_number: newSpeaker.phone_number,
      activation_link: newSpeaker.activation_link,
      is_active: newSpeaker.is_active,
    };
    

    res.status(201).send({
      message:
        "Registration successful! Please check your email to activate your account.",
      speaker: speakerResponse,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const speakers = await Speaker.findAll({
      attributes: ["id", "full_name", "email", "phone_number", "is_active"],
    });
    res.status(200).send({ data: speakers });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findByPk(id, {
      attributes: ["id", "full_name", "email", "phone_number", "is_active"],
    });
    if (!speaker) {
      return sendErrorResponse({ message: "Speaker not found" }, res, 404);
    }
    res.status(200).send({ data: speaker });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const speaker = await Speaker.findByPk(id);
    if (!speaker) {
      return sendErrorResponse({ message: "Speaker not found" }, res, 404);
    }
    await speaker.update(data);
    res.status(200).send({ message: "Speaker updated", data: speaker });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findByPk(id);
    if (!speaker) {
      return sendErrorResponse({ message: "Speaker not found" }, res, 404);
    }
    await speaker.destroy();
    res.status(200).send({ message: "Speaker deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  login,
  logoutSpeaker,
  refreshSpeaker,
  speakerActivate,
  addSpeaker,
  register,
  findAll,
  findOne,
  update,
  remove,
};
