const {
  createOrderForUser,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} = require("../services/orderservice");

const createOrder = async (req, res) => {
  try {
    const order = await createOrderForUser(req.user.id, req.body.items);
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;
    const order = await updateOrderStatus(orderId, status);
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAdminOrders,
  changeOrderStatus,
};
