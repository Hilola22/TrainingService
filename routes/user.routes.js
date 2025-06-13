const {
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
} = require("../controllers/user.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

const router = require("express").Router();

router.post("/", addUser);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshUser);
router.get("/logout", logoutUser);
router.get("/activate/:link", userActivate);
router.get("/", adminJwtGuard, findAll);
router.get("/:id", userJwtGuard, findOne);
router.patch("/:id", userJwtGuard, userSelfGuard, update);
router.delete("/:id", userJwtGuard, userSelfGuard, remove);

module.exports = router;
