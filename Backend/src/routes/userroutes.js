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

router.get("/", verifyToken, authorizeRoles("ADMIN"), getUsers);

router.post("/", verifyToken, authorizeRoles("ADMIN"), createUser);

router.post("/vendors", verifyToken, authorizeRoles("ADMIN"), createVendor);

router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateUser);

router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteUser);

module.exports = router;
