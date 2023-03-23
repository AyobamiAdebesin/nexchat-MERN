const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
/**
 * @route   POST api/message
 * @desc    Send a message
 * @access  Private
 */
router.route("/").post(protect, sendMessage);

/**
 * @router GET /api/message/:chatId
 * @description Gets all messages in a Chat
 * @access Private
 */
router.get("/:chatId", protect, allMessages);

module.exports = router;
