const express = require("express");

const {
  register,
  login,
  getProfile
} = require("../controllers/authcontrollers");
const { verifyToken } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
