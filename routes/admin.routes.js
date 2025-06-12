const {
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
} = require("../controllers/admin.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");

const router = require("express").Router();

router.post("/", adminJwtGuard, addAdmin);
router.post("/login", login);
router.post("/refresh", refreshAdmin);
router.post("/register", registerAdmin);
router.get("/logout", logoutAdmin);
router.get("/activate/:link", adminActivate);
router.get("/", adminJwtGuard, findAll);
router.get("/:id", adminJwtGuard, findOne);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;
