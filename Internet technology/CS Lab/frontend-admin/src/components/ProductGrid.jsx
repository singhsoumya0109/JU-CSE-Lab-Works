import ProductCard from "./ProductCard";

const ProductGrid = ({ products, admin }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isOwned={admin && product.owner === admin._id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
