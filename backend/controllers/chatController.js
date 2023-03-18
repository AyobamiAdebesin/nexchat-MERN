const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
  /**
   * @desc This function will create a new chat or access an existing one-on-one chat
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   */
  const { userToChatWith } = req.body;
  if (!userToChatWith) {
    res.status(400).send("Please provide the user's id");
    throw new Error("Please provide the user's id");
  }

  // Find a chat that is not a group chat and has the current user and the user we want to chat with
  // in the users array and populate the users and latestMessage fields
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userToChatWith } } },
    ],
  })
    .populate(users)
    .populate("latestMessage");
  // Populate the sender field of the latestMessage
  // This is done because the latestMessage field is a reference to the Message model
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  // If such a chat exists, return it
  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    // If such a chat does not exist, create a new one
    var chatData = {
      chatName: "sender",
      users: [req.user._id, userToChatWith],
      isGroupChat: false,
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        -"password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).send(error.message);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  /**
   * @desc This function will fetch all the chats of the current user
   *
   */
  try {
    const currentUser = req.user._id;
    if (currentUser) {
      const filterChatByUser = Chat.find({
        users: { $elemMatch: { $eq: currentUser } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results)
        });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = { accessChat, fetchChats };
