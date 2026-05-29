const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  createVendor,
  updateUser,
  deleteUser,
} = require("../controllers/usercontrollers");
const { verifyToken } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/rolemiddleware");

// GET USERS
router.get("/", verifyToken, authorizeRoles("ADMIN"), getUsers);

// CREATE USER
router.post("/", verifyToken, authorizeRoles("ADMIN"), createUser);

// CREATE VENDOR
router.post("/vendors", verifyToken, authorizeRoles("ADMIN"), createVendor);

router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateUser);

// DELETE USER
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteUser);

module.exports = router;
