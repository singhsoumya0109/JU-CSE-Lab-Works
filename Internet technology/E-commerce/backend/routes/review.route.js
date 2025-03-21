import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import { addReview ,editReview,deleteReview} from "../controllers/review.controller.js";

router.post("/:productId", protectRoute, addReview);
router.patch("/:reviewId", protectRoute, editReview);
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;