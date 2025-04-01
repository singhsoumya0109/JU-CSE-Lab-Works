import { create } from "zustand";
import { takeProduct, returnProduct, getStudentProducts } from "../lib/axios";
import useProductStore from "./useProductStore"; // Import product store

const useOrderStore = create((set) => ({
  studentProducts: [],
  orderLoading: false,
  orderError: null,

  fetchStudentProducts: async (role) => {
    try {
      set({ orderLoading: true, orderError: null });
      const response = await getStudentProducts(role);
      set({ studentProducts: response.data.products, orderLoading: false });
    } catch (error) {
      set({
        orderError: error.response?.data?.message || "Failed to fetch orders",
        orderLoading: false,
      });
    }
  },

  takeProduct: async (role, productId) => {
    try {
      set({ orderLoading: true, orderError: null });
      await takeProduct(role, productId);

      // Update studentProducts list
      set((state) => ({
        studentProducts: [...state.studentProducts, productId],
        orderLoading: false,
      }));

      // Update stock in product store
      useProductStore.setState((state) => ({
        selectedProduct: {
          ...state.selectedProduct,
          stock: Math.max(0, state.selectedProduct.stock - 1),
        },
      }));
    } catch (error) {
      set({
        orderError: error.response?.data?.message || "Failed to take product",
        orderLoading: false,
      });
    }
  },

  returnProduct: async (role, productId) => {
    try {
      set({ orderLoading: true, orderError: null });
      await returnProduct(role, productId);

      // Update studentProducts list
      set((state) => ({
        studentProducts: state.studentProducts.filter((id) => id !== productId),
        orderLoading: false,
      }));

      // Update stock in product store
      useProductStore.setState((state) => ({
        selectedProduct: {
          ...state.selectedProduct,
          stock: state.selectedProduct.stock + 1,
        },
      }));
    } catch (error) {
      set({
        orderError: error.response?.data?.message || "Failed to return product",
        orderLoading: false,
      });
    }
  },
}));

export default useOrderStore;
