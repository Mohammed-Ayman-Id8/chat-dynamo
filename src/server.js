require('dotenv').config();
const express= require("express");
const cors =require("cors");
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');
const usersChats = require('./routes/usersChatsRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(bodyParser.json());
app.use('/chats', chatRoutes);
app.use('/usersChats', usersChats);
app.use('/messages', messageRoutes);

const server = app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = server;

