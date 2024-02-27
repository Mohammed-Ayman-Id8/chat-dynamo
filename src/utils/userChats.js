require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const UsersChats = require('../models/usersChats');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Create a new chat
exports.createUserChat = async (user_id,chat_id) => {
  const usersChats = new UsersChats(user_id,chat_id);

  const params = {
    TableName: 'usersChats',
    Item: usersChats
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Error creating chat:', err);
    } else {
      console.log(`User Chat ${usersChats.user_chat_id} created successfully`)
    }
  });
};

