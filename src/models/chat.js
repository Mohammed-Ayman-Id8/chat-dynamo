const { v4: uuidv4 } = require('uuid');

class Chat {
  constructor(user_id) {
    this.chat_id = uuidv4();
    this.user_id = user_id;
    this.created_Date = new Date().toISOString();
  }
}

module.exports = Chat;

