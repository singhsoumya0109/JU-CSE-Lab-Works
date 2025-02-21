const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const Student = require("../models/studentModel");

// ➤ MIDDLEWARE TO VERIFY JWT TOKEN FOR BOTH ADMIN & STUDENT
const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

      // Check if user is an admin
      let user = await Admin.findById(decoded.id).select("-passwordHash");
      if (!user) {
        // If not found in Admin, check Student
        user = await Student.findById(decoded.id).select("-passwordHash");
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }

      req.user = user; // Attach user (admin or student) to request
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
});

const adminOnly = (req, res, next) => {
  if (req.user && req.user instanceof Admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};


module.exports = { protect, adminOnly };


