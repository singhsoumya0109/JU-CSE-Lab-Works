import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Product from "../models/product.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};


export const isProductOwner = async (req, res, next) => {
  try {
    const productId = req.params.productId; // Adjust based on how you're passing the product ID
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if logged-in user is the owner
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. Not the owner." });
    }

    req.product = product; // Attach product to request if needed later
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying product ownership." });
  }
};
