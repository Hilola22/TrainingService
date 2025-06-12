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
router.get("/:id", adminJwtGuard, adminSelfGuard, findOne);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;
