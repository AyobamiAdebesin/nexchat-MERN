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
    .populate("users")
    .populate("latestMessage");
  // Populate the sender field of the latestMessage
  // This is done because the latestMessage field is a reference to the Message model
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  // If such a chat exists, return it
  if (isChat.length > 0) {
    return res.send(isChat[0]);
    console.log("sending existing chat");
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
      return res.status(200).json(FullChat);
      console.log("sending new chat");
    } catch (error) {
      res.status(400).send(error.message);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  /**
   * @desc This function will fetch all the chats of the current user
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   *
   */
  try {
    const currentUser = req.user._id;
    if (currentUser) {
      const filterChatByUser = Chat.find({
        users: { $elemMatch: { $eq: currentUser } },
      })
        .populate("users")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  /**
   * @desc This function will create a new group chat
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   *
   */
  // Accept an array of users and a name from the body
  // and create an instance of a group chat object
  var users = req.body.users;
  const chatName = req.body.chatName;

  // Check if the users array and the chat name are provided
  if (!users || !chatName) {
    return req.status(400).send({ message: "Please provide users and a name" });
  } else {
    users = JSON.parse(users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    // Add the current user to the users array
    users.push(req.user);

    // Create a new group chat
    try {
      const groupChat = await Chat.create({
        chatName: chatName,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      // Populate the users and groupAdmin fields of the group chat
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users")
        .populate("groupAdmin", "-password");
      return res.send(fullGroupChat);
    } catch (error) {
      res.status(400).send("Unable to create chat");
      throw new Error(error.message);
    }
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const chatName = req.body.chatName;

  const updatedChat = await Chat.findById(chatId);
  updatedChat.chatName = chatName;
  await updatedChat.save();
  res.send(updatedChat);
  // const updatedChat = await Chat.findByIdAndUpdate(
  //   chatId,
  //   {
  //     chatName: chatName,
  //   },
  //   {
  //     new: true,
  //   }
  // )
  //   .populate("users", "-password")
  //   .populate("groupAdmin", "-password");
  // console.log(updatedChat);

  // if (updatedChat) {
  //   return res.send(updatedChat);
  // } else {
  //   res.status(400).send("Unable to update chat");
  //   throw new Error("Unable to update chat");
  // }
});

const addUserToGroupChat = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const chatId = req.body.chatId;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404).send("Chat not found!");
  } else {
    res.status(200).json(added);
  }
});
const removeUserFromGroupChat = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const chatId = req.body.chatId;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404).send("Chat not found!");
  } else {
    res.status(200).json(removed);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeUserFromGroupChat,
  addUserToGroupChat,
};
