import express from "express";
import { getStudentDetails } from "../controllers/student.detail.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Route to fetch student details (Protected)
router.get("/", isAuthenticated, getStudentDetails);

export default router;
