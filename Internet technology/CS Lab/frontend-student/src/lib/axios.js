import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const registerUser = (endpoint, data) =>
  API.post(`/${endpoint}/register`, data);
export const loginUser = (endpoint, data) =>
  API.post(`/${endpoint}/login`, data);

// Student Product APIs
export const getAllProducts = (endpoint) => API.get(`/${endpoint}/products`);
export const takeProduct = (endpoint, productId) =>
  API.post(`/${endpoint}/products/take/${productId}`);
export const returnProduct = (endpoint, productId) =>
  API.post(`/${endpoint}/products/return/${productId}`);
export const getStudentProducts = (endpoint) =>
  API.get(`/${endpoint}/products/my-products`);

export const getProductDetails = (endpoint, productId) =>
  API.get(`/${endpoint}/products/${productId}`);

// Student Details API
export const getStudentDetails = (endpoint) =>
  API.get(`/${endpoint}/details`);
