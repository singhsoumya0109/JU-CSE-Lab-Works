const asyncHandler = require("express-async-handler");
const User = require("../models/adminModel");
const Student = require("../models/studentModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

// ➤ REGISTER ADMIN
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Admin already exists." });
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the admin user
  const user = await User.create({
    username,
    email,
    passwordHash: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
});

// ➤ ADMIN LOGIN
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if admin exists
  const admin = await User.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password." });
  }
});

const authStudent = asyncHandler(async (req, res) => {
  const { email, roll } = req.body;

  // Check if student exists with the given email and roll number
  const student = await Student.findOne({ email, roll });

  if (!student) {
    return res
      .status(404)
      .json({ message: "Student not found or incorrect roll number." });
  }

  // Respond with student details and token
  res.json({
    _id: student._id,
    name: student.name,
    email: student.email,
    roll: student.roll,
    deptCode: student.deptCode,
    token: generateToken(student._id),
  });
});


module.exports = { registerUser, authAdmin, authStudent };