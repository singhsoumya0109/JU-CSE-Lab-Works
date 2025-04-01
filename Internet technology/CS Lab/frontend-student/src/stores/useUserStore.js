import { create } from "zustand";
import { toast } from "react-hot-toast";
import { getStudentDetails } from "../lib/axios"; // Import API function

const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("token"),
  student: JSON.parse(localStorage.getItem("student")) || null,

  login: (token) => {
    localStorage.setItem("token", token);
    set({ isLoggedIn: true });
    toast.success("Logged in successfully!");
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("student");
    set({ isLoggedIn: false, student: null });
    toast.success("Logged out successfully!");
  },

  fetchStudentDetails: async (endpoint) => {
    try {
      const { data } = await getStudentDetails(endpoint);
      localStorage.setItem("student", JSON.stringify(data)); // Store in localStorage
      set({ student: data });
      //toast.success("Student details loaded!");
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details.");
    }
  },
}));

export default useAuthStore;
