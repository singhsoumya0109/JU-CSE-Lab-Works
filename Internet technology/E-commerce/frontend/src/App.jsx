import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/loadingspinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/productDetails";
import Payment from "./pages/paymentPage";
import OrderPage from "./pages/OrderPage";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import { useCartStore } from "./stores/useCartStore";


function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient - Removed to avoid blocking links */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div> */}

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={!user ? <Navigate to="/login" /> :<OrderPage />} />
        </Routes>
      </div>
      <Toaster />
      <footer className="bg-gray-800 text-white py-4 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <span className="text-lg">&copy; Soumyadeep Singh</span>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a
              href="https://www.linkedin.com/in/soumyadeep-singh-347044258/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="bi bi-linkedin text-xl"></i>
            </a>
            <a
              href="https://github.com/singhsoumya0109"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="bi bi-github text-xl"></i>
            </a>
            <a
              href="https://singhsoumya0109.github.io/Portfolio-website/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <i className="bi bi-briefcase text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
