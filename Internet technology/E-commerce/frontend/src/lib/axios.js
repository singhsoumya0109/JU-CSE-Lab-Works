import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust based on your backend URL
  withCredentials: true, // Send cookies with requests
  headers: { "Content-Type": "application/json" },
});

let refreshPromise = null;

// Axios Interceptor for Handling Token Expiry and Refreshing
instance.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }

        const newAccessToken = await refreshPromise;
        refreshPromise = null;

        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // Retry the failed request
        }
      } catch (refreshError) {
        refreshPromise = null;
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Set Authorization Header if Token Exists in LocalStorage
const token = localStorage.getItem("accessToken");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
