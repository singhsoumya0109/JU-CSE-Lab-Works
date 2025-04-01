const ProductInfo = ({ product }) => {
  if (!product) {
    return <div className="text-center text-gray-400">Product not found</div>;
  }

  return (
    <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />
      <p className="mt-4 text-gray-300">{product.description}</p>
      <p className="mt-2 text-gray-400">Category: {product.category}</p>
      <p className="mt-2 text-gray-400">Stock: {product.stock}</p>
    </div>
  );
};

export default ProductInfo;
