const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const expressAsyncHandler = require("express-async-handler");

const sendMessage = expressAsyncHandler(async (req, res) => {
  sender = req.user._id;
  chatId = req.body.chatId;
  content = req.body.content;

  if (!chatId || !content) {
    res.status(400).send("Invalid request");
    throw new Error("Invalid request");
  }

  // Create a new message JS object containing the sender, content and chatId
  // that will be passed to the Message model
  //var messageObject = ;

  // Create and save the message to the database
  try {
    var message = await Message.create({
      sender: sender,
      content: content,
      chat: chatId,
    });
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Updates the latestMessage field of the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error.message);
    throw new Error(error.message);
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { sendMessage, allMessages };
