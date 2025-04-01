import mongoose from "mongoose";
import Product from "../models/product.model.js";

const MONGO_URI = "mongodb://localhost:27017/Lab_Record";

const clearStudentsTaken = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Product.updateMany(
      {},
      { $set: { studentsTaken: [] } }
    );

    console.log(`Updated ${result.modifiedCount} products.`);
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error clearing studentsTaken:", error);
    process.exit(1);
  }
};

clearStudentsTaken();
