import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Refers to the admin who listed the product
      required: true,
    },
    studentsTaken: {
      type: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Student who took the product
          quantity: { type: Number, default: 1, min: 1 }, // Number of products taken
        },
      ],
      default: [],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
