/**
 * @file server.js
 * @description This file contains the server code for the chat application.
 * Author: Ayobami Adebesin
 */
const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const app = express();
const userRouter = require("./routes/userRouter");
const connectDB = require("./config/db");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");

// Load env vars from .env file into process.env before we connect to the database
// This is so that we can use the environment variables in the database connection
// and also to start the server on the port specified in the .env file
dotenv.config();

// Connect to database
connectDB();

// Use json data
app.use(express.json());

// Body parser
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routes
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});

// Socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://172.30.152.200:3000", // This is the frontend url
  },
});

// Create a connection to the socket
io.on("connection", (socket) => {
  console.log("Connected to Socket IO");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`${userData.name} has created setup`);
    socket.emit("connected");
  });

  // This creates a new room with the second
  // user when the current logged in user clicks
  // on any of the chats
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  // Socket for typing indicator
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  // Socket for stop typing indicator
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // This is used to send a message to the other user
  // when the current logged in user sends a message
  socket.on("new message", (newMessageReceived) => {
    // Get which chat the message belongs to
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected from Socket IO");
    socket.leave(userData._id);
  });
});
