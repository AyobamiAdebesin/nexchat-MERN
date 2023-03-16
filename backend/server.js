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


// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Body parser
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/api/chat', (req, res) => {
    res.send(chats);
})

app.get('/api/chat/:id', (req, res) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`.red.bold);
});
