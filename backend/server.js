/**
 * @file server.js
 * @description This file contains the server code for the chat application.
 * Author: Ayobami Adebesin
 */
const express = require('express');
const chats = require('./data/data');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRouter');
const connectDB = require('./config/db');
const chatRouter = require('./routes/chatRouter');
const messageRouter = require('./routes/messageRouter');

// Load env vars from .env file into process.env before we connect to the database
// This is so that we can use the environment variables in the database connection
// and also to start the server on the port specified in the .env file
dotenv.config();

// Connect to database
connectDB();

// Use json data
app.use(express.json());

// Body parser
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Use routes
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use("/api/messages", messageRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`);
});
