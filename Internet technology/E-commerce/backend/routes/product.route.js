import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getFeauturedProducts,
  createProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toggleFeaturedProduct,
  getProductById,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeauturedProducts);
router.get("/recommendations", getRecommendations);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById); 
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

export default router;
