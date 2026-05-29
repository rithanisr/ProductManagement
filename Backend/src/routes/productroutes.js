const express = require("express");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontrollers");
const { verifyToken } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/rolemiddleware");
const { uploadSingleImage } = require("../middleware/multer");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("ADMIN", "VENDOR", "USER"),
  getProducts,
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("VENDOR", "ADMIN"),
  uploadSingleImage,
  createProduct,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("VENDOR", "ADMIN"),
  uploadSingleImage,
  updateProduct,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("VENDOR", "ADMIN"),
  deleteProduct,
);

module.exports = router;
