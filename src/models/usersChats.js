const { v4: uuidv4 } = require('uuid');

class usersChats {
  constructor(user_id, chat_id) {
    this.user_chat_id = uuidv4();
    this.chat_id = chat_id;
    this.user_id = user_id;
    this.created_Date = new Date().toISOString();
  }
}

module.exports = usersChats;

