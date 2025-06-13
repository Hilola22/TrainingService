const { sendErrorResponse } = require("../helpers/send.error.response");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const { userJwtService } = require("../services/jwt.service");
const mailService = require("../services/mail.service");
const logger = require("../services/logger.service");
const { userSchema } = require("../validation/user.validation");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendErrorResponse({ message: "User not found" }, res, 401);
    }

    let hashPassword = await bcrypt.compare(password, user.hashed_password);

    if (!hashPassword) {
      return sendErrorResponse(
        { message: "Email or password incorrect" },
        res,
        400
      );
    }
    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
    };
    console.log(payload);

    const tokens = userJwtService.generateTokens(payload);

    user.hashed_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_user"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      id: user.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Refresh token not found in Cookie" },
        res,
        400
      );
    }
    const user = await User.findOne({ where: { hashed_token: refreshToken } });
    
    if (!user) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }
    user.hashed_token = null;
    await user.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refreshUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Refresh token not found in Cookies" },
        res,
        400
      );
    }

    await userJwtService.verifyRefreshToken(refreshToken);

    const user = await User.findOne({ where: { hashed_token: refreshToken } });
    if (!user) {
      return sendErrorResponse(
        { message: "Refresh token not found" },
        res,
        400
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
    };

    const tokens = userJwtService.generateTokens(payload);

    user.hashed_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_user"),
    });

    return res.status(201).send({
      message: "Tokens updated successfully",
      id: user.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const userActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const user = await User.findOne({ where: { activation_link: link } });

    if (!user) {
      return sendErrorResponse({ message: "User link incorrect" }, res, 400);
    }

    if (user.is_active) {
      return sendErrorResponse(
        { message: "This user link was activated before" },
        res,
        400
      );
    }

    user.is_active = true;
    await user.save();
    res.send({
      message: "User link activated successfully",
      isActive: user.is_active,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const addUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      logger.error(`Validation error in addUser: ${error.details[0].message}`);
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { email, password, full_name, phone_number } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(
        { message: "User with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    const newUser = await User.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      activation_link,
      is_active: true,
    });

    res.status(201).send({
      message: "New user added successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        is_active: newUser.is_active,
      },
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(
        { message: "User with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    const newUser = await User.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      is_active: false,
      activation_link,
    });

    const activationUrl = `${config.get(
      "api_url"
    )}/api/users/activate/${activation_link}`;
    await mailService.sendMail(email, activationUrl);

    const payload = {
      id: newUser.id,
      email: newUser.email,
      is_active: newUser.is_active,
    };

    const tokens = userJwtService.generateTokens(payload);
    await newUser.update({ hashed_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_user"),
    });

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      phone_number: newUser.phone_number,
      activation_link: activation_link,
      is_active: newUser.is_active,
    };

    res.status(201).send({
      message:
        "Registration successful! Please check your email to activate your account.",
      user: userResponse,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send({ data: users });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }
    res.status(200).send({ data: user });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }
    await user.update(data);
    res.status(200).send({ message: "User updated", data: user });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }
    await user.destroy();
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  login,
  logoutUser,
  refreshUser,
  userActivate,
  addUser,
  register,
  findAll,
  findOne,
  update,
  remove,
};
