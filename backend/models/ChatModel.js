const mongoose = require('mongoose');

const chatModel = new mongoose.schema(
    {
        chatName: { type: String, required: true, trim: true },
        isGroupChat: { type: Boolean, required: true, default: false },
        users: [
            { type: mongoose.Schema.Type.ObjectId },
            { ref: 'User' }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const Chat = mongoose.model('Chat', chatModel);
module.exports = Chat;