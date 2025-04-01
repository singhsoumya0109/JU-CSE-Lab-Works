import { create } from "zustand";
import { toast } from "react-hot-toast";

const useAdminStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("token"),
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  role: localStorage.getItem("role") || null,

  login: (adminData, token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("admin", JSON.stringify(adminData));
    set({ isLoggedIn: true, admin: adminData, role });
    toast.success("Logged in successfully!");
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    set({ isLoggedIn: false, admin: null, role: null });
    toast.success("Logged out successfully!");
  },
}));

export default useAdminStore;
