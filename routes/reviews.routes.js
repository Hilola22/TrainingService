const router = require("express").Router();
const {
  update,
  remove,
  findAll,
  findOne,
  addReview,
} = require("../controllers/reviews.controller");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

router.post("/", addReview);
router.get("/", findAll);
router.get("/:id", findOne);
router.patch("/:id", userJwtGuard, userSelfGuard, update);
router.delete("/:id", remove);

module.exports = router;
