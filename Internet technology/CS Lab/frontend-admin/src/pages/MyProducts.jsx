import React, { useEffect, useState } from "react";
import useProductStore from "../stores/useProductStore";
import MyProductList from "../components/MyProductList";

const MyProducts = () => {
  const [admin, setAdmin] = useState(null);
  const { myProducts, fetchMyProducts, loading, error } = useProductStore();

  useEffect(() => {
    setAdmin(JSON.parse(localStorage.getItem("admin")) || null);
    fetchMyProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-2xl font-semibold mb-4">My Products</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {myProducts?.length === 0 && !loading && (
        <p className="text-gray-500">You haven't added any products yet.</p>
      )}

      <MyProductList products={myProducts} />
    </div>
  );
};

export default MyProducts;
