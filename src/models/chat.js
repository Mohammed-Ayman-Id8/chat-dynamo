const { v4: uuidv4 } = require('uuid');

class Chat {
  constructor() {
    this.chat_id = uuidv4();
    this.created_at = new Date().toISOString();
  }
}

module.exports = Chat;

