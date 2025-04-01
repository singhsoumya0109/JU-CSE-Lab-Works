import mongoose from "mongoose";
import { Student } from "../models/user.model.js"; 
const MONGO_URI = "mongodb://localhost:27017/Lab_Record";
const clearAssignedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const result = await Student.updateMany(
      {},
      { $set: { assignedProducts: [] } }
    );
    console.log(`${result.modifiedCount} student(s) updated.`);
  } catch (error) {
    console.error("Error clearing assigned products:", error);
  } finally {
    mongoose.connection.close();
  }
};

clearAssignedProducts();
