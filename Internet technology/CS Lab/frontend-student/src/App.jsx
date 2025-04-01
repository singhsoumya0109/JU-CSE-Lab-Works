import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import DashboardPage from "./pages/DashboardPage"; // Import Dashboard Page
import Navbar from "./components/Navbar";
import useAuthStore from "./stores/useUserStore";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App({ role }) {
  return (
    <Router>
      <Toaster reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register role={role} />} />
        <Route path="/login" element={<Login role={role} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage role={role} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute>
              <ProductDetailsPage role={role} />
            </ProtectedRoute>
          }
        />
        {/* Protected route for Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage role={role} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
