import React from "react";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";

const ProductList = ({ products, loading, error }) => {
  if (loading) return <p className="text-gray-300 text-center">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (products.length === 0)
    return <p className="text-gray-300 text-center">No products available.</p>;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <Link to={`/product/${product.id || product._id}`} key={product.id || product._id}>
          <ProductItem product={product} />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
