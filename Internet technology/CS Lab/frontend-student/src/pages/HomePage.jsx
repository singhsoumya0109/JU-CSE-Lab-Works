import React, { useEffect } from "react";
import useProductStore from "../stores/useProductStore";
import ProductList from "../components/ProductList";

const HomePage = ({ role }) => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const storedStudent = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    const userRole = role || localStorage.getItem("role");
    if (userRole) {
      fetchProducts(userRole);
    }
  }, [role, fetchProducts]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-semibold">Welcome {storedStudent.name}</h2>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold">Available Products</h3>
        <ProductList products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default HomePage;
