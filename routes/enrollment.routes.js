const router = require("express").Router();
const {
  update,
  remove,
  findAll,
  findOne,
  TrainingUsedUser,
  createEnrollment,
  StatusCancelled,
} = require("../controllers/enrollment.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

router.post("/", userJwtGuard, createEnrollment);
router.get("/", adminJwtGuard, findAll);
router.get("/participants", adminJwtGuard, TrainingUsedUser);
router.get("/status", adminJwtGuard, StatusCancelled);
router.get("/:id", userJwtGuard, findOne);
router.patch("/:id", adminJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
