require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const { createChat } = require('../utils/chats');
const { saveMessage } = require('../utils/messages');
const Message = require('../models/message');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Create a new message
exports.createMessage = async (req, res) => {
  const { chatId, body, sender, receiver } = req.body;
  
  if (!chatId) {
    // Create a chat if chatId doesn't exist
      const chatId =await createChat(sender, receiver)
      const message = new Message(chatId, body, sender);
      console.log('message', message)
      saveMessage(message, res);
  } else {
    const message = new Message(chatId, body, sender);
     saveMessage(message, res);
  }
};
exports.getMessage = (req, res) => {
  const { messageId } = req.params;

  const params = {
    TableName: 'messages',
    Key: {
      message_id: messageId
    }
  };

  dynamodb.get(params, (err, data) => {
    if (err) {
      console.error('Error getting message:', err);
      res.status(500).json({ error: 'Error getting message' });
    } else {
      if (!data.Item) {
        res.status(404).json({ error: 'Message not found' });
      } else {
        res.status(200).json(data.Item);
      }
    }
  });
};
// Get messages by chat
exports.getChatMessages = (req, res) => {
  const { chatId } = req.params;

  const params = {
    TableName: 'messages',
    IndexName: 'chat_id-index', 
    KeyConditionExpression: 'chat_id = :id',
    ExpressionAttributeValues: {
      ':id': chatId
    }
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error('Error getting messages:', err);
      res.status(500).json({ error: 'Error getting messages' });
    } else {
      if (!data.Items || data.Items.length === 0) {
        res.status(404).json({ error: 'Messages not found' });
      } else {
        res.status(200).json(data.Items);
      }
    }
  });
};
// Update a message
exports.updateMessage = (req, res) => {
  const { messageId } = req.params;
  const { body } = req.body;

  const params = {
    TableName: 'messages',
    Key: {
      message_id: messageId
    },
    UpdateExpression: 'set body = :b',
    ExpressionAttributeValues: {
      ':b': body
    },
    ReturnValues: 'ALL_NEW'
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Error updating message:', err);
      res.status(500).json({ error: 'Error updating message' });
    } else {
      res.status(200).json(data.Attributes);
    }
  });
};
// Delete a message
exports.deleteMessage = (req, res) => {
  const { messageId } = req.params;

  const params = {
    TableName: 'messages',
    Key: {
      message_id: messageId
    }
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error('Error deleting message:', err);
      res.status(500).json({ error: 'Error deleting message' });
    } else {
      res.status(204).send();
    }
  });
};
