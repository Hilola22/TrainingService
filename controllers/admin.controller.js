const { sendErrorResponse } = require("../helpers/send.error.response");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const { adminJwtService } = require("../services/jwt.service");
const mailService = require("../services/mail.service");
const logger = require("../services/logger.service");
const { adminSchema } = require("../validation/admin.validation");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return sendErrorResponse({ message: "Admin not found" }, res, 401);
    }

    let hashPassword = await bcrypt.compare(password, admin.hashed_password);

    if (!hashPassword) {
      return sendErrorResponse(
        { message: "Email or password incorrect" },
        res,
        400
      );
    }
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
    };

    const tokens = adminJwtService.generateTokens(payload);

    await admin.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_admin"),
    });

    res.status(200).send({
      message: "Welcome to admin panel",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Refresh token not found in Cookie" },
        res,
        400
      );
    }

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });

    if (admin) {
      admin.refresh_token = "";
      await admin.save();
    }

    res.clearCookie("refreshToken");
    res.send({ admin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refreshAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Refresh token not found in Cookies" },
        res,
        400
      );
    }

    await adminJwtService.verifyRefreshToken(refreshToken);

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin) {
      return sendErrorResponse(
        { message: "Refresh token not found" },
        res,
        400
      );
    }

    const payload = {
      id: admin.id,
      email: admin.email,
    };

    const tokens = adminJwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_admin"),
    });

    return res.status(201).send({
      message: "Tokens updated successfully",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const registerAdmin = async (req, res) => {
  const SERVER_SECRET_KEY = "secretKeyAdmin";
  try {
    const { email, password, full_name, phone_number, secretKey } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return sendErrorResponse(
        { message: "Admin with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    if (secretKey !== SERVER_SECRET_KEY) {
      return sendErrorResponse(
        { message: "Unauthorized admin registration" },
        res,
        403
      );
    }

    const newAdmin = await Admin.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      activation_link,
      is_active: false,
    });

    const activationUrl = `${config.get(
      "api_url"
    )}/api/user/activate/${activation_link}`;
    await mailService.sendMail(email, activationUrl);

    const payload = {
      id: newAdmin.id,
      email: newAdmin.email,
      is_active: newAdmin.is_active,
    };

    const tokens = adminJwtService.generateTokens(payload);
    await newAdmin.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time_admin"),
    });

    const userResponse = {
      id: newAdmin.id,
      email: newAdmin.email,
      full_name: newAdmin.full_name,
      phone_number: newAdmin.phone_number,
      activation_link: newAdmin.activation_link,
      is_active: newAdmin.is_active,
    };

    res.status(201).send({
      message:
        "Registration successful! Please check your email to activate your account.",
      admin: userResponse,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const adminActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const admin = await Admin.findOne({ activation_link: link });

    if (!admin) {
      return sendErrorResponse({ message: "Admin link incorrect" }, res, 400);
    }

    if (admin.is_active) {
      return sendErrorResponse(
        { message: "This admin link was activated before" },
        res,
        400
      );
    }

    admin.is_active = true;
    await admin.save();
    res.send({
      message: "Admin link activated successfully",
      isActive: admin.is_active,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const addAdmin = async (req, res) => {
  try {
    const { error } = adminSchema.validate(req.body);
    if (error) {
      logger.error(`Validation error in addAdmin: ${error.details[0].message}`);
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { email, password, full_name, phone_number, secretKey } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return sendErrorResponse(
        { message: "Admin with this email already exists" },
        res,
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();

    const newAdmin = await Admin.create({
      email,
      hashed_password: hashedPassword,
      full_name,
      phone_number,
      activation_link,
      is_active: true,
    });

    res.status(201).send({
      message: "New admin added successfully!",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        full_name: newAdmin.full_name,
        phone_number: newAdmin.phone_number,
        is_active: newAdmin.is_active,
      },
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ["id", "full_name", "email", "phone_number", "is_active"],
    });
    res.status(200).send({ data: admins });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return sendErrorResponse({ message: "Admin not found" }, res, 404);
    }
    res.status(200).send({ data: admin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return sendErrorResponse({ message: "Admin not found" }, res, 404);
    }
    await admin.update(data);
    res.status(200).send({ message: "Admin updated", data: admin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return sendErrorResponse({ message: "Admin not found" }, res, 404);
    }
    await admin.destroy();
    res.status(200).send({ message: "Admin deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  login,
  logoutAdmin,
  refreshAdmin,
  adminActivate,
  addAdmin,
  findAll,
  findOne,
  update,
  remove,
  registerAdmin,
};
