const { sendErrorResponse } = require("../helpers/send.error.response");
const BuildingImages = require("../models/building_image.model");
const logger = require("../services/logger.service");
const { buildingImageSchema } = require("../validation/building_image.validation");

const addBuildingImage = async (req, res) => {
  try {
    const { error } = buildingImageSchema.validate(req.body);
    if (error) {
      logger.error(
        `Validation error in addBuildingImage: ${error.details[0].message}`
      );
      return sendErrorResponse({ message: error.details[0].message }, res, 400);
    }
    const { image_url, buildingId } = req.body;

    const newBuildingImage = await BuildingImages.create({
      image_url,
      buildingId,
    });
    res
      .status(201)
      .send({ message: "New building image added", data: newBuildingImage });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const building_images = await BuildingImages.findAll();
    res.status(200).send({
      data: building_images,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const building_image = await BuildingImages.findByPk(id);
    if (!building_image) {
      return res.status(404).send({ message: "Building image not found" });
    }
    res.status(200).send({ data: building_image });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, buildingId } = req.body;
    const building_image = await BuildingImages.findByPk(id);
    if (!building_image) {
      return res.status(404).send({ message: "Building image not found" });
    }
    await building_image.update(
      { image_url, buildingId },
      {
        where: { id },
      }
    );

    const updatedBuildingImage = await BuildingImages.findByPk(id);

    res.status(200).send({
      message: "BuildingImage updated successfully",
      data: updatedBuildingImage,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const BuildingImage = await BuildingImages.findByPk(id);
    if (!BuildingImage) {
      return res.status(404).send({ message: "BuildingImage not found" });
    }

    await BuildingImage.destroy();

    res.status(200).send({
      message: "Building image deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  addBuildingImage,
  findAll,
  findOne,
  update,
  remove,
};
