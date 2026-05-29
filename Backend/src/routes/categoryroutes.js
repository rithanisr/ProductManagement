const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} = require("../controllers/categorycontrollers");
const { verifyToken } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/rolemiddleware");

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("ADMIN", "VENDOR", "USER"), getCategories);
router.get("/:id/products", verifyToken, authorizeRoles("ADMIN", "VENDOR", "USER"), getCategoryProducts);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createCategory);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteCategory);

module.exports = router;
