import express from "express";
import {
  addProduct,
  getProductUsers,
  getLowStockProducts,
  getMyListedProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProductStock, // Added function to update stock
} from "../controllers/admin.product.controller.js";
import {
  isAuthenticated,
  isAdmin,
  isProductOwner,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin-only routes
router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.get(
  "/product-users/:productId",
  isAuthenticated,
  isAdmin,
  isProductOwner,
  getProductUsers
);

// Get all products (visible to authenticated users)
router.get("/", isAuthenticated, getAllProducts);

// Get details of a specific product (Authenticated users)
router.get("/product/:productId", isAuthenticated, getProductDetails);

// Get all products with low stock (Admin only)
router.get("/low-stock", isAuthenticated, isAdmin, getLowStockProducts);

// Get all products listed by the admin
router.get("/my-products", isAuthenticated, isAdmin, getMyListedProducts);

// Update product details (only owner admin can update)
router.put(
  "/update-product/:productId",
  isAuthenticated,
  isAdmin,
  isProductOwner,
  updateProduct
);

// Update stock of a product (only owner admin can update)
router.put(
  "/update-stock/:productId",
  isAuthenticated,
  isAdmin,
  isProductOwner,
  updateProductStock
);

// Delete a product (only owner admin can delete)
router.delete(
  "/delete-product/:productId",
  isAuthenticated,
  isAdmin,
  isProductOwner,
  deleteProduct
);

export default router;
