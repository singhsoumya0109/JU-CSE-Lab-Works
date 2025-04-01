import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../stores/useUserStore";
import useProductStore from "../stores/useProductStore";
import useOrderStore from "../stores/useOrderStore";

const ProductDetailsPage = ({ role }) => {
  const { productId } = useParams();
  const { isLoggedIn } = useAuthStore();
  const { selectedProduct, productLoading, productError, fetchProductDetails } =
    useProductStore();
  const { orderLoading, takeProduct, returnProduct } = useOrderStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchProductDetails(role, productId);
    }
  }, [productId, isLoggedIn, fetchProductDetails, role]);

  if (productLoading)
    return <p className="text-gray-300 text-center text-lg">Loading...</p>;
  if (productError)
    return <p className="text-red-500 text-center text-lg">{productError}</p>;
  if (!selectedProduct)
    return (
      <p className="text-gray-300 text-center text-lg">Product not found.</p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-gray-800 shadow-2xl rounded-lg p-8 max-w-4xl w-full text-white">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center border-b border-gray-700 pb-3">
          {selectedProduct.name}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Left: Product Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full max-w-xs md:max-w-sm h-80 object-cover rounded-lg shadow-lg border border-gray-700"
            />
          </div>

          {/* Right: Product Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <p className="bg-gray-700 inline-block px-3 py-1 rounded-full text-sm uppercase tracking-wider">
              {selectedProduct.category}
            </p>
            <p className="text-gray-300 text-lg mt-4">
              {selectedProduct.description}
            </p>

            {/* Stock Status */}
            <div className="mt-4">
              <p className="text-gray-400 font-semibold">Stock Availability:</p>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mt-2">
                <div
                  className="bg-green-500 h-4 transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      5,
                      (selectedProduct.stock / 100) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-gray-300">
                {selectedProduct.stock} available
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => takeProduct(role, productId)}
                className="flex-1 px-6 py-3 rounded-lg text-white font-bold transition bg-green-500 hover:bg-green-600 shadow-md"
              >
                {orderLoading ? "Processing..." : "Take"}
              </button>

              <button
                onClick={() => returnProduct(role, productId)}
                className="flex-1 px-6 py-3 rounded-lg text-white font-bold transition bg-red-500 hover:bg-red-600 shadow-md"
              >
                {orderLoading ? "Processing..." : "Return"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
