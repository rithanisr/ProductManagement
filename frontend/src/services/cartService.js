import api from "./api";

const STORAGE_KEY = "user_cart_items";

const readLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  return cart;
};

export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data?.cart || [];
  } catch {
    return readLocalCart();
  }
};

export const addToCart = async (product) => {
  try {
    const response = await api.post("/cart", { product, quantity: 1 });
    return response.data?.cart || response.data || [];
  } catch {
    const cart = readLocalCart();
    if (!cart.some((item) => item.product.id === product.id)) {
      cart.push({ product, quantity: 1 });
    }
    return saveLocalCart(cart);
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data?.cart || response.data || [];
  } catch {
    const cart = readLocalCart().map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    return saveLocalCart(cart);
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data?.cart || response.data || [];
  } catch {
    const cart = readLocalCart().filter(
      (item) => item.product.id !== productId,
    );
    return saveLocalCart(cart);
  }
};
