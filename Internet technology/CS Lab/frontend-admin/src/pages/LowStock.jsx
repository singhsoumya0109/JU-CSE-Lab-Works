import React, { useEffect } from "react";
import useProductStore from "../stores/useProductStore";
import LowStockList from "../components/LowStockList";

const LowStock = () => {
  const { lowStockProducts, fetchLowStockProducts, loading, error } =
    useProductStore();

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Low Stock Products
      </h1>

      {loading && (
        <p className="text-center text-blue-500 dark:text-blue-400">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      )}

      {lowStockProducts.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No low stock products found.
        </p>
      ) : (
        <LowStockList products={lowStockProducts} />
      )}
    </div>
  );
};

export default LowStock;
