import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/loadingspinner";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";
import useReviewStore from "../stores/useReviewStore";

const ProductDetails = () => {
  const { id } = useParams();
  const { fetchProductById, product, loading } = useProductStore();
  const { user } = useUserStore();
  const { addReview, editReview, deleteReview, reviews } = useReviewStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchProductById(id);
  }, [id, reviews]); // Refresh when reviews change

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingReview) {
      await editReview(editingReview._id, { rating, comment });
      setEditingReview(null);
    } else {
      await addReview(id, { rating, comment });
    }
    setRating(5);
    setComment("");
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    await deleteReview(reviewId);
  };

  if (loading) return <LoadingSpinner />;
  if (!product)
    return <div className="text-center text-red-500">Product not found</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-cover rounded-lg shadow-lg"
        />
        <div className="md:ml-10 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">{product.description}</p>
          <p className="text-green-500 text-xl mt-4">₹{product.price}</p>
          <p className="text-gray-400 mt-2">Category: {product.category}</p>
          <p className="text-yellow-400 mt-2">
            Rating: {product.averageRating?.toFixed(1) || "No rating"} ⭐
          </p>
        </div>
      </div>

      {/* Add/Edit Review Form */}
      {user && (
        <div className="mt-10 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold">
            {editingReview ? "Edit Your Review" : "Add a Review"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block mb-2 text-lg">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ⭐
                </option>
              ))}
            </select>

            <label className="block mt-4 mb-2 text-lg">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg"
              rows="3"
            ></textarea>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </button>

            {editingReview && (
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="ml-4 text-red-400 hover:underline"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <ul className="mt-2">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <li key={review._id} className="border-b border-gray-700 py-4">
                <p className="text-lg font-medium">{review.user.name}</p>
                <p className="text-yellow-400">{review.rating} ⭐</p>
                <p className="text-gray-400">{review.comment}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                {user && user._id === review.user._id && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-400 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
