const router = require("express").Router();
const {
  createPayment,
  update,
  remove,
  findAll,
  findOne,
  getClientPayment,
} = require("../controllers/payment.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");

router.post("/", userJwtGuard, createPayment);
router.get("/", adminJwtGuard, findAll);
router.get("/client-payment", adminJwtGuard, getClientPayment);
router.get("/:id", adminJwtGuard, findOne);
router.patch("/:id", userJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
