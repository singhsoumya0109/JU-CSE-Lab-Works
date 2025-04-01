import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import studentRoutes from "./routes/student.route.js";
import adminRoutes from "./routes/admin.route.js";
import adminProductRoutes from "./routes/admin.product.route.js"; 
import studentProductRoutes from "./routes/student.product.route.js";
import studentDetailsRoutes from "./routes/student.details.route.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow CORS for both frontends
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Student and Admin frontend
    credentials: true,
  })
);

// Routes for authentication
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", adminProductRoutes); 
app.use("/api/student/products", studentProductRoutes);
app.use("/api/student/details",studentDetailsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
