const { sendErrorResponse } = require("../helpers/send.error.response");
const Buildings = require("../models/buildings.model")

const createBuilding = async (req, res) => {
  try {
    const { building_name, floor, room, price_per_hour, location, description} = req.body;

    const newBuilding = await Buildings.create({
      building_name,
      floor,
      room,
      price_per_hour,
      location,
      description,
    });

    res
      .status(201)
      .send({ message: "New Building created", data: newBuilding });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const buildings = await Buildings.findAll();
    res.status(200).send({
      data: buildings,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Buildings.findByPk(id);
    if (!building) {
      return res.status(404).send({ message: "Building not found" });
    }
    res.status(200).send({ data: building });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      building_name,
      floor,
      room,
      price_per_hour,
      location,
      description,
    } = req.body;
    const building = await Buildings.findByPk(id);
    if (!building) {
      return res.status(404).send({ message: "Building not found" });
    }
    await Buildings.update(
      {
        building_name,
        floor,
        room,
        price_per_hour,
        location,
        description,
      },
      {
        where: { id },
      }
    );

    const updatedBuilding = await Buildings.findByPk(id);

    res.status(200).send({
      message: "Building updated successfully",
      data: updatedBuilding,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const Building = await Buildings.findByPk(id);
    if (!Building) {
      return res.status(404).send({ message: "Building not found" });
    }

    await Building.destroy();

    res.status(200).send({
      message: "Building deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createBuilding,
  findAll,
  findOne,
  update,
  remove,
};
