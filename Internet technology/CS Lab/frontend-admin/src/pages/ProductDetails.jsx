import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import ProductInfo from "../components/ProductInfo";
import ProductUsersList from "../components/ProductUsersList";
import StockUpdateForm from "../components/StockUpdateForm";

const ProductDetails = () => {
  const { productId } = useParams();
  const {
    productDetails,
    fetchProductDetails,
    updateStock,
    productUsers,
    fetchProductUsers,
  } = useProductStore();

  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    fetchProductDetails(productId);
    fetchProductUsers(productId);
  }, [productId]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 text-white p-6">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        {/* Product Details */}
        <ProductInfo product={productDetails} />

        {/* Users List & Stock Update */}
        {admin?._id === productDetails?.owner && (
          <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Users using this product:
            </h2>
            <ProductUsersList users={productUsers} />
            <StockUpdateForm
              productId={productId}
              updateStock={updateStock}
              fetchProductDetails={fetchProductDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
