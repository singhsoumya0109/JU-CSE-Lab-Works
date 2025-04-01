import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Attach JWT token only for product APIs
API.interceptors.request.use((config) => {
  // Get token from localStorage (or sessionStorage, wherever you're storing)
  const token = localStorage.getItem("token");

  // If request is for a product API, attach token
  if (config.url.startsWith("/admin/products") && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Authentication
export const registerUser = (endpoint, data) =>
  API.post(`/${endpoint}/register`, data);
export const loginUser = (endpoint, data) =>
  API.post(`/${endpoint}/login`, data);

// Product APIs

// Add a new product
export const addProduct = (data) =>
  API.post("/admin/products/add-product", data);

// Get all products (for authenticated users)
export const getAllProducts = () => API.get("/admin/products");

// Get products listed by the logged-in admin
export const getMyProducts = () => API.get("/admin/products/my-products");

// Get low stock products (admin only)
export const getLowStockProducts = () => API.get("/admin/products/low-stock");

// Get details of a specific product
export const getProductDetails = (productId) =>
  API.get(`/admin/products/product/${productId}`);

// Get users who are using a specific product
export const getProductUsers = (productId) =>
  API.get(`/admin/products/product-users/${productId}`);

// Update product details
export const updateProduct = (productId, data) =>
  API.put(`/admin/products/update-product/${productId}`, data);

// Update stock of a specific product
export const updateProductStock = (productId, stock) =>
  API.put(`/admin/products/update-stock/${productId}`, { stock });

// Delete a product
export const deleteProduct = (productId) =>
  API.delete(`/admin/products/delete-product/${productId}`);
