const express = require("express");
const router = express.Router();
const {
  registerUser,
  authAdmin,
  authStudent,
} = require("../controllers/userControllers");

router.route("/signup").post(registerUser); // Admin Signup
router.post("/admin/login", authAdmin); // Admin Login
router.post("/student/login", authStudent); // Student Login

module.exports = router;
