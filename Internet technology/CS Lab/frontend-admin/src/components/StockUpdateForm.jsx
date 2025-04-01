import { useState } from "react";

const StockUpdateForm = ({ productId, updateStock, fetchProductDetails }) => {
  const [newStock, setNewStock] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleStockUpdate = async (e) => {
    e.preventDefault();

    if (!newStock || isNaN(newStock) || newStock < 0) {
      setUpdateError("Invalid stock value");
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    try {
      await updateStock(productId, Number(newStock));
      setNewStock("");
      fetchProductDetails(productId);
    } catch (err) {
      setUpdateError("Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleStockUpdate}>
        <label className="block text-gray-300 mb-2">Update Stock:</label>
        <input
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new stock"
        />
        <button
          type="submit"
          disabled={updating}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
        >
          {updating ? "Updating..." : "Update Stock"}
        </button>
        {updateError && <p className="mt-2 text-red-500">{updateError}</p>}
      </form>
    </div>
  );
};

export default StockUpdateForm;
