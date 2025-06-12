const router = require("express").Router();
const {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  trainingServices,
  getTopSpeakersByTraining,
} = require("../controllers/training.controller");
const speakerJwtGuard = require("../middlewares/guards/speaker-jwt.guard");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");
const speakerSelfGuard = require("../middlewares/guards/speaker-self.guard");

router.post("/", adminJwtGuard, createTraining);
router.get("/", getAllTrainings);
router.get("/services", trainingServices)
router.get("/topspeakers", getTopSpeakersByTraining)
router.get("/:id", getTrainingById);
router.patch("/:id", speakerJwtGuard, speakerSelfGuard, updateTraining);
router.delete("/:id", adminJwtGuard, deleteTraining);

module.exports = router;
