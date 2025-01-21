const jwt = require("jsonwebtoken"); // For creating and verifying JSON Web Tokens (JWTs)
const User = require("../models/userModel.js"); // Importing the User model to interact with the database
const asyncHandler = require("express-async-handler"); // Middleware to handle async functions and errors in Express

// Middleware to protect routes (authentication)
const protect = asyncHandler(async (req, res, next) => {
  let token; // Variable to store the token

  // Check if the `Authorization` header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the `Authorization` header
      token = req.headers.authorization.split(" ")[1];

      // Decode the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve the user from the database using the ID from the token payload
      req.user = await User.findById(decoded.id).select("-password");

      // Call the `next` function to pass control to the next middleware or route handler
      next();
    } catch (error) {
      // Handle errors, such as invalid or expired token
      res.status(401);
      throw new Error("Not authorised. Token failed");
    }
  } else {
    // Handle the case where no token is provided
    res.status(401);
    throw new Error("Not authorised. No token provided");
  }
});

// Exporting the `protect` middleware
module.exports = { protect };

/*
Short Note:
This code defines a middleware function `protect` to secure routes by verifying JWT tokens. It checks for a `Bearer` token in the `Authorization` header, verifies its authenticity using a secret key, and retrieves the associated user's information from the database (excluding the password). If the token is valid, the user's data is attached to the `req` object, allowing subsequent middleware or route handlers to access it. Unauthorized requests are handled by returning a `401 Unauthorized` status with appropriate error messages.
*/
