const { v4: uuidv4 } = require('uuid');

class Message {
  constructor(chatId, body, sender) {
    this.messageId = uuidv4();
    this.chatId = chatId;
    this.body = body;
    this.sender = sender;
  }
}

module.exports = Message;
