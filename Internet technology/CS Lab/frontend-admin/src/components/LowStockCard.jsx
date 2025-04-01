import { Link } from "react-router-dom";

const LowStockCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="w-full sm:w-64">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border dark:border-gray-700 hover:shadow-lg transition-shadow">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {product.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Stock:</strong> {product.stock}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          <strong>Description:</strong> {product.description}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          <strong>Category:</strong> {product.category}
        </p>
      </div>
    </Link>
  );
};

export default LowStockCard;
