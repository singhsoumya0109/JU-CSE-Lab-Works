const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {sendMessage,allMessages}=require("../controlllers/messageControllers")
const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router;