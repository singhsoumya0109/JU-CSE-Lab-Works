import React from "react";

const ProductItem = ({ product }) => {
  return (
    <li className="p-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white flex flex-col items-center">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-lg mb-3 border border-gray-500"
      />
      <h4 className="text-lg font-semibold">{product.name}</h4>
      <p className="text-gray-400">Category: {product.category}</p>
    </li>
  );
};

export default ProductItem;
