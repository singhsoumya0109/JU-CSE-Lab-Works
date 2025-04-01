import React from "react";
import { Link } from "react-router-dom";
import useAdminStore from "../stores/useAdminStore"; // adjust path if needed

export default function HomePage() {
  const { admin } = useAdminStore();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">
        Welcome {admin?.name || "Admin"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {/* All Products */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">All Products</h2>
          <p className="text-gray-400 mb-4">
            View all products listed in the system.
          </p>
          <Link to="/products">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View Products
            </button>
          </Link>
        </div>

        {/* My Products */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">My Products</h2>
          <p className="text-gray-400 mb-4">Check your own listed products.</p>
          <Link to="/my-products">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              View My Products
            </button>
          </Link>
        </div>

        {/* Low Stock */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Low Stock</h2>
          <p className="text-gray-400 mb-4">Products with low stock count.</p>
          <Link to="/low-stock">
            <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600">
              View Low Stock
            </button>
          </Link>
        </div>

        {/* Users */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">
            Users Using My Products
          </h2>
          <p className="text-gray-400 mb-4">
            See who is currently using your products.
          </p>
          <Link to="/my-products">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              View Users
            </button>
          </Link>
        </div>
      </div>

      {/* Add Product */}
      <div className="flex justify-center">
        <Link to="/add-product">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md">
            ➕ Add New Product
          </button>
        </Link>
      </div>
    </div>
  );
}
