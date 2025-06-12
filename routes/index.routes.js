const router = require("express").Router();
const userRouter = require("./user.routes");
const speakerRouter = require("./speaker.routes");
const adminRouter = require("./admin.routes");
const trainingRouter = require("./training.routes");
const buildingRouter = require("./building.routes");
const certificateRouter = require("./certificate.routes");
const imageRouter = require("./building_image.routes");
const reviewsRouter = require("./reviews.routes");
const paymentRouter = require("./payment.routes");
const enrollmentRouter = require("./enrollment.routes");
const attendanceRouter = require("./attendance.routes");

router.use("/users", userRouter);
router.use("/speakers", speakerRouter);
router.use("/admins", adminRouter);
router.use("/trainings", trainingRouter);
router.use("/buildings", buildingRouter);
router.use("/certificates", certificateRouter);
router.use("/image", imageRouter);
router.use("/reviews", reviewsRouter);
router.use("/enrollment", enrollmentRouter);
router.use("/payment", paymentRouter);
router.use("/attendance", attendanceRouter);

module.exports = router;
