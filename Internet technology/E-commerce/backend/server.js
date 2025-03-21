import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import reviewRoutes from "./routes/review.route.js";
import orderRoutes from "./routes/order.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend
    credentials: true, // Allow sending cookies
}));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);


app.listen(PORT, () => {
    console.log("Server is running at port " + PORT);
    connectDB();
})