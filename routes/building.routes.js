const router = require("express").Router();
const {
  createBuilding,
  update,
  remove,
  findAll,
  findOne,
} = require("../controllers/buildings.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");

router.post("/", adminJwtGuard, createBuilding);
router.get("/", findAll);
router.get("/:id", findOne);
router.patch("/:id", adminJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
