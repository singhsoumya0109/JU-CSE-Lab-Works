const express = require("express");
const { registerUser ,authUser,allUsers} = require("../controlllers/userControllers");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/signup").post(registerUser);

router.post("/login", authUser);

router.route("/search").get(protect,allUsers);

module.exports = router;