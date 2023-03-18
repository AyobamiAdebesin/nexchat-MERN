const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

class chatController {
  static async accessChat(req, res) {
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
    // in the users array
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userToChatWith } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
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
  }
}
module.exports = chatController;
