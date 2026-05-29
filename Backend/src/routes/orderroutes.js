const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAdminOrders,
  changeOrderStatus,
} = require("../controllers/ordercontrollers");
const { verifyToken } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/rolemiddleware");

const router = express.Router();

router.post("/orders", verifyToken, authorizeRoles("USER"), createOrder);
router.get("/orders", verifyToken, getMyOrders);
router.get("/orders/my-orders", verifyToken, getMyOrders);
router.put(
  "/orders/:id/status",
  verifyToken,
  authorizeRoles("ADMIN"),
  changeOrderStatus,
);
router.get(
  "/admin/orders",
  verifyToken,
  authorizeRoles("ADMIN"),
  getAdminOrders,
);

module.exports = router;
