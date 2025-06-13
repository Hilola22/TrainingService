const router = require("express").Router();
const {
  update,
  remove,
  findAll,
  findOne,
  createAttendance,
} = require("../controllers/attendance.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");

router.post("/",adminJwtGuard, createAttendance);
router.get("/", adminJwtGuard, findAll);
router.get("/:id", adminJwtGuard, findOne);
router.patch("/:id", adminJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
