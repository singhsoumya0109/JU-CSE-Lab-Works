import { Admin } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, employeeId, designation } = req.body;

    // Check if email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Check if employeeId already exists
    const existingEmployee = await Admin.findOne({ employeeId });
    if (existingEmployee)
      return res.status(400).json({ message: "Employee ID already exists" });

    // Create and save new admin
    const admin = new Admin({ name, email, password, employeeId, designation });
    await admin.save();

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({ message: "Admin registered successfully", token, role: "admin",admin });
  } catch (error) {
    console.log("Error in admin register controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password, employeeId } = req.body;

    const admin = await Admin.findOne({ email });

    // If email is not found, check for employeeId
    if (!admin) {
      const existingEmployee = await Admin.findOne({ employeeId });
      if (existingEmployee) {
        return res
          .status(400)
          .json({
            message: "Employee ID already exists, but email is incorrect",
          });
      }
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, role: "admin" ,admin});
  } catch (error) {
    console.log("Error in admin login controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
