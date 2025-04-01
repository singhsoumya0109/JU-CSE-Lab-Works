import MyProductCard from "./MyProductCard";

const MyProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
      {products.map((product) => (
        <MyProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default MyProductList;
