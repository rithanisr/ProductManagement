import api from "./api";

const STORAGE_KEY = "user_wishlist_items";

const readLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (wishlist) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  return wishlist;
};

export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    return response.data?.wishlist || [];
  } catch {
    return readLocalWishlist();
  }
};

export const addToWishlist = async (product) => {
  try {
    const response = await api.post("/wishlist", { product });
    return response.data?.wishlist || response.data || [];
  } catch {
    const wishlist = readLocalWishlist();
    if (!wishlist.some((item) => item.id === product.id)) {
      wishlist.push(product);
    }
    return saveLocalWishlist(wishlist);
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data?.wishlist || response.data || [];
  } catch {
    const wishlist = readLocalWishlist().filter(
      (item) => item.id !== productId,
    );
    return saveLocalWishlist(wishlist);
  }
};
