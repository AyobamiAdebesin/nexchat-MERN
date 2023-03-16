const mongoose = require("mongoose");

const userModel = new mongoose.schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userModel);
module.exports = User;
