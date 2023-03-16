const express = require('express');
const chats = require('./data/data');

const app = express()
const PORT = 5000;



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
app.listen(5000, () => {
    console.log(`Server started on port ${PORT}`);
});
