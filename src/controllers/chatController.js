require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const Chat = require('../models/chat');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Create a new chat
exports.createChat = async (req, res) => {

  const body = req.body
  const { user1, user2 } = body;
  const chat = new Chat(user1, user2);
  console.log('chat',chat)
  const params = {
    TableName: 'chats',
    Item: chat
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Error creating chat:', err);
      res.status(500).json({ error: 'Error creating chat' });
    } else {
      res.status(201).json(chat);
    }
  });
};
//get all chats
exports.getChats =  async (req,res) => {
  const params = {
      TableName: 'chats',
  };
  const chats = await dynamodb.scan(params).promise();

  return res.status(200).json(chats);
};
// Get a chat by chatId
exports.getChat = (req, res) => {
  const { chatId } = req.params;
  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chatId
    }
  };

  dynamodb.get(params, (err, data) => {
    if (err) {
      console.error('Error getting chat:', err);
      res.status(500).json({ error: 'Error getting chat' });
    } else {
      if (!data.Item) {
        res.status(404).json({ error: 'Chat not found' });
      } else {
        res.status(200).json(data.Item);
      }
    }
  });
};
// Get chats by userId
exports.getUserChats = (req, res) => {
  const { userId } = req.params;
  const params = {
    TableName: 'chats',
    Key: {
      user_id: userId
    }
  };

  dynamodb.get(params, (err, data) => {
    if (err) {
      console.error('Error getting chat:', err);
      res.status(500).json({ error: 'Error getting chat' });
    } else {
      if (!data.Item) {
        res.status(404).json({ error: 'Chat not found' });
      } else {
        res.status(200).json(data.Item);
      }
    }
  });
};

// Update a chat
exports.updateChat = (req, res) => {
  const { chatId } = req.params;
  const { user1, user2 } = req.body;

  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chatId
    },
    UpdateExpression: 'set user1 = :u1, user2 = :u2',
    ExpressionAttributeValues: {
      ':u1': user1,
      ':u2': user2
    },
    ReturnValues: 'ALL_NEW'
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Error updating chat:', err);
      res.status(500).json({ error: 'Error updating chat' });
    } else {
      res.status(200).json(data.Attributes);
    }
  });
};

// Delete a chat
exports.deleteChat = (req, res) => {
  const { chatId } = req.params;

  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chatId
    }
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error('Error deleting chat:', err);
      res.status(500).json({ error: 'Error deleting chat' });
    } else {
      res.status(204).send();
    }
  });
};
