import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserPlus, LogOut } from "lucide-react";
import useAdminStore from "../stores/useAdminStore";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAdminStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 shadow-lg bg-gray-800 text-white border-b border-gray-700">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
      >
        <BookOpen size={24} />
        JU-CS Labs
      </Link>
      <div className="flex gap-3">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="flex items-center gap-1 border border-gray-600 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm">
                <LogIn size={25} />
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-500 transition-colors text-sm">
                <UserPlus size={25} />
                Signup
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-md hover:bg-red-500 transition-colors text-sm"
          >
            <LogOut size={25} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
