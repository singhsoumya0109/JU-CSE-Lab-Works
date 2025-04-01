import { Navigate } from "react-router-dom";
import useAdminStore from "../stores/useAdminStore";
import LoadingSpinner from "./LoadingSpinner";

const AuthRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAdminStore();

  if (isLoading) return <LoadingSpinner />;

  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

export default AuthRoute;
