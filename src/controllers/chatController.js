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
  const { user_id } = body;
  const chat = new Chat(user_id);
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
  const { chat_id } = req.params;
  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chat_id
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
  const { user_id } = req.params;
  // query Global Secondary Index
  const params = {
    TableName: 'chats',
    IndexName: 'user_id-index',
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id
    }
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error('Error getting chats:', err);
      res.status(500).json({ error: 'Error getting chats' });
    } else {
      if (data.Items.length === 0) {
        res.status(404).json({ error: 'No Chats found' });
      } else {
        res.status(200).json(data.Items);
      }
    }
  });
};

// Update a chat
exports.updateChat = (req, res) => {
  const { chat_id } = req.params;
  const { user_id } = req.body; 

  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chat_id
    },
    UpdateExpression: 'set user_id = :uid', 
    ExpressionAttributeValues: {
      ':uid': user_id
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
  const { chat_id } = req.params;

  const params = {
    TableName: 'chats',
    Key: {
      chat_id: chat_id
    }
  };
  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error('Error deleting chat:', err);
      res.status(500).json({ error: 'Error deleting chat' });
    } else {
      res.status(204).send("Deleted successfully");
    }
  });
};
