const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeUserFromGroupChat,
  addUserToGroupChat,
} = require("../controllers/chatController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// For accessing the chat or creating the chat
router.route("/").post(protect, accessChat);

// For fetching chats from the db for that particular user
router.get("/", protect, fetchChats);

// For creation of a group
router.post("/group", protect, createGroupChat);

// For renaming group chats
router.put("/rename", protect, renameGroupChat);

// For removing users to a group chat
router.put("/removeuser", protect, removeUserFromGroupChat);

// For adding users to a group chat
router.put('/adduser', protect, addUserToGroupChat);

module.exports = router;
