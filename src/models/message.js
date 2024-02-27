const { v4: uuidv4 } = require('uuid');

class Message {
  constructor(chatId, body, sender) {
    this.message_id = uuidv4();
    this.chat_id = chatId;
    this.body = body;
    this.sender = sender;
  }
}

module.exports = Message;
