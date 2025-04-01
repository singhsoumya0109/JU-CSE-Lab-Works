import LowStockCard from "./LowStockCard";

const LowStockList = ({ products }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {products.map((product) => (
        <LowStockCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default LowStockList;
