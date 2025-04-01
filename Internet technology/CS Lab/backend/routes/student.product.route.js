import express from "express";
import {
  getAllProducts,
  getProductDetails, 
  takeProduct,
  returnProduct,
  getStudentProducts,
} from "../controllers/student.product.controller.js";
import { isAuthenticated, isStudent } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllProducts);

// New route to get details of a particular product
router.get("/:productId", isAuthenticated, getProductDetails);

// Route to take a product
router.post("/take/:productId", isAuthenticated, isStudent, takeProduct);

// Route to return a product
router.post("/return/:productId", isAuthenticated, isStudent, returnProduct);

// Route to get products assigned to a student
router.get("/my-products", isAuthenticated, isStudent, getStudentProducts);

export default router;
