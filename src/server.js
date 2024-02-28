const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');
const usersChats = require('./routes/usersChatsRoutes');
const messageRoutes = require('./routes/messageRoutes');

const path = require("path");
const Message = require("./models/message");
const { saveMessageWs } = require("./utils/messages");

const __filenameGlobal = __filename;
const __dirnameGlobal = path.dirname(__filenameGlobal);

const app = express();
app.use(express.static(path.join(__dirnameGlobal, "public")));
const port = process.env.PORT || 8000;

app.use(cors());

app.use(bodyParser.json());
app.use('/chats', chatRoutes);
app.use('/usersChats', usersChats);
app.use('/messages', messageRoutes);

const expressServer = app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

// Counter for generating unique user IDs
let userIdCounter = 0;

io.on("connection", (socket) => {

  const { roomId, sender, receiver } = socket.handshake.query;
  socket.join(roomId);
  console.log(`User ${socket.id} connected to room ${roomId}`);

  const userId = `user-${++userIdCounter}`;


  socket.on('message', async (message) => {
    io.to(roomId).emit('message', message);

    // Create a new message
    // const { roomId, body, sender, receiver } = message;
    
    if (!roomId) {
      // Create a chat if chatId doesn't exist
      const chatId = await createChat(sender, receiver);
      const newMessage = new Message(chatId, message, sender);
      console.log('newMessage', newMessage);
      saveMessageWs(newMessage);
    } else {
      const newMessage = new Message(roomId, message, sender);
      saveMessageWs(newMessage);
    }
  });

  socket.on('message', (message) => {
    io.to(roomId).emit('message', message);
});
  // Listen for activity
  socket.on("activity", () => {
    socket.broadcast.emit("activity", userId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

module.exports = expressServer;
