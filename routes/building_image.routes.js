const router = require("express").Router();
const {
  addBuildingImage,
  update,
  remove,
  findAll,
  findOne,
} = require("../controllers/building_image.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");

router.post("/", adminJwtGuard, addBuildingImage);
router.get("/", findAll);
router.get("/:id", findOne);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;
