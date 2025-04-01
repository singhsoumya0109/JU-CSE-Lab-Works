import { Link } from "react-router-dom";

const ProductCard = ({ product, isOwned }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-700 hover:border-gray-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 flex flex-col gap-2">
          {isOwned && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md w-fit">
              Own product
            </span>
          )}
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <p className="text-gray-400 text-sm">{product.description}</p>
          <p className="text-sm text-gray-300">
            <span className="font-medium">Category:</span> {product.category}
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-medium">Stock:</span> {product.stock}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
