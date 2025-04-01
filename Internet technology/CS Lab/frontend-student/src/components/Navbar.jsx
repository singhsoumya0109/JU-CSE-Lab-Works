import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useUserStore";
import {
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide">
          JU LABS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center bg-green-700 px-4 py-2 rounded-lg transition hover:bg-green-800"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 px-4 py-2 rounded-lg transition hover:bg-red-600"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center bg-gray-800 px-4 py-2 rounded-lg transition hover:bg-gray-700"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-green-500 px-4 py-2 rounded-lg transition hover:bg-green-600"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 items-center bg-blue-800 p-4 rounded-lg">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center w-full justify-center bg-green-700 px-4 py-2 rounded-lg transition hover:bg-green-800"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full justify-center bg-red-500 px-4 py-2 rounded-lg transition hover:bg-red-600"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center w-full justify-center bg-gray-800 px-4 py-2 rounded-lg transition hover:bg-gray-700"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center w-full justify-center bg-green-500 px-4 py-2 rounded-lg transition hover:bg-green-600"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
