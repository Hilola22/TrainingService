const router = require("express").Router();
const {
  createCertificate,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/certificates.controller");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

router.post("/", adminJwtGuard, createCertificate);
router.get("/", adminJwtGuard,findAll);
router.get("/:id", userJwtGuard, userSelfGuard, findOne);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;
