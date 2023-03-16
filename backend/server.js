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

// Use json data
app.use(express.json());

// Body parser
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Use routes
app.use('/api/users', userRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`);
});
