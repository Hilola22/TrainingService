const {
  login,
  logoutSpeaker,
  refreshSpeaker,
  speakerActivate,
  addSpeaker,
  register,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/speaker.controller");
const speakerJwtGuard = require("../middlewares/guards/speaker-jwt.guard");
const speakerSelfGuard = require("../middlewares/guards/speaker-self.guard");

const router = require("express").Router();

router.post("/", speakerJwtGuard, addSpeaker);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshSpeaker);
router.get("/logout", logoutSpeaker);
router.get("/activate/:link", speakerActivate);
router.get("/", speakerJwtGuard, findAll);
router.get("/:id", speakerJwtGuard, speakerSelfGuard, findOne);
router.patch("/:id", speakerJwtGuard, speakerSelfGuard, update);
router.delete("/:id", speakerJwtGuard, speakerSelfGuard, remove);

module.exports = router;
