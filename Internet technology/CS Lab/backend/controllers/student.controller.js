import { Student } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, yearOfStudy } =
      req.body;

    // Check if email already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Check if rollNumber already exists
    const existingRollNumber = await Student.findOne({ rollNumber });
    if (existingRollNumber)
      return res.status(400).json({ message: "Roll number already exists" });

    // Create and save new student
    const student = new Student({
      name,
      email,
      password,
      rollNumber,
      department,
      yearOfStudy,
    });
    await student.save();

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
        .json({
          student,
        message: "Student registered successfully",
        token,
        role: "student",
      });
  } catch (error) {
    console.log("Error in student register controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginStudent = async (req, res) => {
  try {
    const { email, password, rollNumber } = req.body;

    const student = await Student.findOne({ email });

    // If email is not found, check for roll number
    if (!student) {
      const existingRollNumber = await Student.findOne({ rollNumber });
      if (existingRollNumber) {
        return res
          .status(400)
          .json({ message: "Roll number exists, but email is incorrect" });
      }
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ student, token, role: "student" });
  } catch (error) {
    console.log("Error in student login controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
