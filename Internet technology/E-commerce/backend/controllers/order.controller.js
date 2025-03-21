import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js"; // Import User model
import { generateCouponCode } from "../utils/couponUtils.js";

// Save an order
const saveOrder = async (req, res) => {
  try {
    const { products, totalAmount, couponCode } = req.body;
    const userId = req.user.id;

    // Check if a coupon is used and remove it
    if (couponCode) {
      await Coupon.deleteOne({ code: couponCode, userId });
    }

    // Transform the products array to match the schema
    const formattedProducts = products.map((p) => ({
      product: p._id, // Store only the ObjectId
      quantity: p.quantity, // Store quantity
      price: p.price, // Store price
    }));

    const newOrder = new Order({
      products: formattedProducts,
      totalAmount,
      user: userId,
    });

    await newOrder.save();

    // If order is above 1000, generate a coupon
    if (totalAmount > 1000) {
      const newCoupon = new Coupon({
        code: generateCouponCode(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId,
      });

      await newCoupon.save();
    }

    // Clear user's cart after successful order
    await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// Fetch all user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "products.product",
        model: "Product", // Explicitly referencing the Product model
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export { saveOrder, getUserOrders };
