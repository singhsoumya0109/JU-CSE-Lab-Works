import { create } from "zustand";
import { getAllProducts, getProductDetails } from "../lib/axios";

const useProductStore = create((set) => ({
  products: [],
  loading: true,
  error: null,
  selectedProduct: null,
  productLoading: false,
  productError: null,

  fetchProducts: async (role) => {
    try {
      set({ loading: true, error: null });
      const response = await getAllProducts(role);
      const products = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];
      set({ products, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch products",
        loading: false,
        products: [],
      });
    }
  },

  fetchProductDetails: async (role, productId) => {
    try {
      set({ productLoading: true, productError: null });
      const response = await getProductDetails(role, productId);
      set({ selectedProduct: response.data, productLoading: false });
    } catch (error) {
      set({
        productError:
          error.response?.data?.message || "Failed to fetch product details",
        productLoading: false,
        selectedProduct: null,
      });
    }
  },
}));

export default useProductStore;
