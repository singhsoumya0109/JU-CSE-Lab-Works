import { Navigate } from "react-router-dom";
import useAdminStore from "../stores/useAdminStore";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAdminStore();

  if (isLoading) return <LoadingSpinner />;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
