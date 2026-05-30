import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart as fetchCart,
  addToCart as addCartItem,
  updateCartItem as updateCartQuantity,
  removeFromCart as deleteCartItem
} from "../services/cartService";
import {
  getWishlist as fetchWishlist,
  addToWishlist as addWishlistItem,
  removeFromWishlist as deleteWishlistItem
} from "../services/wishlistService";
import { getOrders as fetchOrders, placeOrder as submitOrder } from "../services/orderService";
import { getProfile as fetchProfile, updateProfile as saveProfile } from "../services/profileService";

const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [cartData, wishlistData, ordersData, profileData] = await Promise.all([
        fetchCart(),
        fetchWishlist(),
        fetchOrders(),
        fetchProfile()
      ]);

      setCart(cartData || []);
      setWishlist(wishlistData || []);
      setOrders(ordersData || []);
      setProfile(profileData || null);
    } catch (loadError) {
      setError(loadError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const addToCart = useCallback(
    async (product) => {
      const existing = cart.find((entry) => entry.product.id === product.id);
      if (existing) {
        return false;
      }

      try {
        const updated = await addCartItem(product);
        setCart(updated);
        return true;
      } catch (serviceError) {
        setError(serviceError.message || "Unable to add to cart.");
        return false;
      }
    },
    [cart]
  );

  const setQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) {
        return;
      }

      try {
        const updated = await updateCartQuantity(productId, quantity);
        setCart(updated);
      } catch (serviceError) {
        setError(serviceError.message || "Unable to update cart quantity.");
      }
    },
    []
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        const updated = await deleteCartItem(productId);
        setCart(updated);
      } catch (serviceError) {
        setError(serviceError.message || "Unable to remove from cart.");
      }
    },
    []
  );

  const addToWishlist = useCallback(
    async (product) => {
      const existing = wishlist.find((entry) => entry.id === product.id);
      if (existing) {
        return false;
      }

      try {
        const updated = await addWishlistItem(product);
        setWishlist(updated);
        return true;
      } catch (serviceError) {
        setError(serviceError.message || "Unable to add to wishlist.");
        return false;
      }
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        const updated = await deleteWishlistItem(productId);
        setWishlist(updated);
      } catch (serviceError) {
        setError(serviceError.message || "Unable to remove from wishlist.");
      }
    },
    []
  );

  const moveWishlistToCart = useCallback(
    async (product) => {
      const added = await addToCart(product);
      if (!added) {
        return false;
      }

      await removeFromWishlist(product.id);
      return true;
    },
    [addToCart, removeFromWishlist]
  );

  const placeOrder = useCallback(
    async () => {
      if (cart.length === 0) {
        setError("Your cart is empty.");
        return false;
      }

      try {
        const result = await submitOrder(cart);

        if (Array.isArray(result)) {
          setOrders(result);
        } else {
          setOrders((currentOrders) => [result, ...currentOrders]);
        }

        setCart([]);
        return true;
      } catch (serviceError) {
        setError(serviceError.message || "Unable to place order.");
        return false;
      }
    },
    [cart]
  );

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        const updated = await saveProfile(profileData);
        setProfile(updated);
        return true;
      } catch (serviceError) {
        setError(serviceError.message || "Unable to save profile.");
        return false;
      }
    },
    []
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.product.price || 0) * (item.quantity || 1), 0),
    [cart]
  );
  const toggleWishlist = (product) => {
  setWishlist(prev => {
    const exists = prev.some(item => item.id === product.id);
    if (exists) {
      return prev.filter(item => item.id !== product.id);
    } else {
      return [...prev, product];
    }
  });
};

  const value = {
    cart,
    wishlist,
    orders,
    profile,
    loading,
    error,
    cartTotal,
    addToCart,
    setQuantity,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    placeOrder,
    updateProfile,
    loadData,
    toggleWishlist
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => useContext(UserDataContext);
