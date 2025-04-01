import Product from "../models/product.model.js";
import { Admin,Student } from "../models/user.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } }); // Fetch only products with stock > 0
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addProduct = async (req, res) => {
  try {
    const { name, description, category, stock, image } = req.body;
    const adminId = req.user.id;

    // Validate input
    if (!name || !description || !category || stock === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user is an admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin access only" });
    }

    // Create and save the new product
    const newProduct = new Product({
      name,
      description,
      category,
      stock,
      image,
      owner: adminId, // Set owner as the admin
    });

    await newProduct.save();

    // Add the product to the admin's listed products
    admin.listedProducts.push(newProduct._id);
    await admin.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};



export const getMyListedProducts = async (req, res) => {
  try {
    const adminId = req.user._id;
    // console.log(adminId);

    // Fetch products where the owner is the admin
    const listedProducts = await Product.find({ owner: adminId });

    if (!listedProducts.length) {
      return res.status(404).json({ message: "No products found" });
    }
    //console.log(listedProducts);
    res.json({ listedProducts });
  } catch (error) {
    console.error("Error fetching listed products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * Get students who have taken a specific product
 */
export const getProductUsers = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch product and populate studentsTaken with full student details
    const product = await Product.findById(productId)
      .populate({
        path: "studentsTaken.student", // Correctly referencing 'student' field inside 'studentsTaken'
        model: "User", // Use 'User' instead of 'Student' since Student is a discriminator of User
        select: "-password", // Exclude password field for security
      })
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract the students with their respective quantities
    const studentsUsing = product.studentsTaken.map((entry) => ({
      ...entry.student, // Spread student details
      quantity: entry.quantity, // Include quantity
    }));

    res.json({
      product: product.name,
      studentsUsing,
    });
  } catch (error) {
    console.error("Error in getProductUsers:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * Get all low-stock products (Admin Only)
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = req.query.threshold || 5; // Default threshold: 5
    const ownerId = req.user._id; // Assuming your auth middleware adds req.user

    // Fetch products with stock less than threshold and owner same as logged-in user
    const lowStockProducts = await Product.find({
      stock: { $lt: threshold },
      owner: ownerId,
    });

    if (lowStockProducts.length === 0) {
      return res.json({
        message: "No low-stock products found for this owner",
      });
    }

    res.json({
      message: "Low stock products",
      products: lowStockProducts,
    });
  } catch (error) {
    console.error("Error in getLowStockProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update product details (Admin Only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete a product (Admin Only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Remove the product from all admins' listedProducts arrays
    await Admin.updateMany(
      { listedProducts: productId },
      { $pull: { listedProducts: productId } }
    );

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({ message: "Stock updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
