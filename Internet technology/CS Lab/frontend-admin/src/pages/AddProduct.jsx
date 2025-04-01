import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../stores/useProductStore";

const AddProduct = () => {
  const { createProduct, loading, error } = useProductStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(formData);
    if (!error) navigate("/products");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400"
          ></textarea>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 rounded font-bold"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
