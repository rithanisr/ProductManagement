import api from "./api";

const STORAGE_KEY = "user_order_history";

const readLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return orders;
};

export const getOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data?.orders || [];
  } catch {
    return readLocalOrders();
  }
};

export const placeOrder = async (cartItems) => {
  const fallbackOrder = {
    id: `order_${Date.now()}`,
    items: cartItems,
    total: cartItems.reduce(
      (sum, item) =>
        sum + Number(item.product.price || 0) * (item.quantity || 1),
      0,
    ),
    status: "Pending",
    date: new Date().toISOString(),
  };

  try {
    const response = await api.post("/orders", {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });

    return response.data?.order || response.data?.orders || fallbackOrder;
  } catch {
    const orders = readLocalOrders();
    const updated = [fallbackOrder, ...orders];
    saveLocalOrders(updated);
    localStorage.removeItem("user_cart_items");
    return updated;
  }
};
