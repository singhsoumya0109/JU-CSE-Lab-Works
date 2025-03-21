import { create } from "zustand";
import toast from "react-hot-toast";

import axios from "../lib/axios";

const useReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  addReview: async (productId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`/reviews/${productId}`, reviewData, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        reviews: [...state.reviews, response.data.review],
        loading: false,
      }));
      toast.success("Review added successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add review";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  editReview: async (reviewId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/reviews/${reviewId}`, reviewData, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        ),
        loading: false,
      }));
      toast.success("Review edited successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to edit review";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  deleteReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/reviews/${reviewId}`);
      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== reviewId),
        loading: false,
      }));
      toast.success("Review deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete review";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));

export default useReviewStore;
