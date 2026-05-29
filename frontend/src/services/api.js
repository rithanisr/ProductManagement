import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const getUsers = () => api.get("/user");

export const deleteUser = (userId) => api.delete(`/user/${userId}`);

export const createVendor = (payload) => api.post("/user/vendors", payload);

export const updateUser = (userId, payload) =>
  api.put(`/user/${userId}`, payload);

export const getProducts = (params = {}) => api.get("/products", { params });

export const getProductById = async (productId) => {
  const response = await getProducts();
  const product = response.data?.products?.find(
    (item) => String(item.id) === String(productId),
  );
  return { data: product || null };
};

export const getVendorProducts = (params = {}) => getProducts(params);

export const createProduct = (payload) => api.post("/products", payload);

export const createVendorProduct = (payload) => createProduct(payload);

export const updateProduct = (productId, payload) =>
  api.put(`/products/${productId}`, payload);

export const updateVendorProduct = (productId, payload) =>
  updateProduct(productId, payload);

export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`);

export const deleteVendorProduct = (productId) => deleteProduct(productId);

export const getVendorAnalytics = (params = {}) => getProducts(params);

export const getCategories = () => api.get("/categories");

export const getCategoryProducts = (categoryId) =>
  api.get(`/categories/${categoryId}/products`);

export const createCategory = (payload) => api.post("/categories", payload);

export const updateCategory = (categoryId, payload) =>
  api.put(`/categories/${categoryId}`, payload);

export const deleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`);
