require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const { createUserChat } = require('./userChats');

const Chat = require('../models/chat');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Create a new chat
exports.createChat = async (user1_id, user2_id) => {
    const chat = new Chat();
  
    const params = {
      TableName: 'chats',
      Item: chat
    };
  
    dynamodb.put(params, (err, data) => {
      if (err) {
        console.error('Error creating chat:', err);
      } else {
        console.log(`Chat ${chat.chat_id} created successfully`)
      }
    });
    createUserChat(user1_id, chat.chat_id);
    createUserChat(user2_id, chat.chat_id);
    
    return chat.chat_id;
  };
  