import ProductCard from "./ProductCard";

const AssignedProducts = ({ products }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mt-6 text-blue-300">
        Assigned Products
      </h3>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No assigned products.</p>
      )}
    </div>
  );
};

export default AssignedProducts;
