import express from "express";
import { saveOrder,getUserOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, saveOrder); 
router.get("/", protectRoute, getUserOrders); 

export default router;
