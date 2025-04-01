import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import { useEffect } from "react";
import useAdminStore from "./stores/useAdminStore";
import AllProducts from "./pages/AllProducts";
import MyProducts from "./pages/MyProducts";
import LowStock from "./pages/LowStock";
import UsersPage from "./pages/UsersPage";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";

function App({ role }) {
  const setLoading = useAdminStore((state) => state.setLoading);

  useEffect(() => {
    // Simulate checking token (replace with your real logic if needed)
    setTimeout(() => {
      //setLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      <Navbar role={role} />
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage role={role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AllProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-products"
          element={
            <ProtectedRoute>
              <MyProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/low-stock"
          element={
            <ProtectedRoute>
              <LowStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register role={role} />
            </AuthRoute>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login role={role} />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
