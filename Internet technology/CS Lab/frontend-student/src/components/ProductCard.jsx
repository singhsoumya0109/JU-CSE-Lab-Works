import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
    >
      <img
        src={product.image || "/default-product.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h4 className="text-lg font-semibold">{product.name}</h4>
      <p className="text-sm text-gray-400">Category: {product.category}</p>
      <p className="text-sm text-gray-400">Quantity: {product.quantity}</p>
    </Link>
  );
};

export default ProductCard;
