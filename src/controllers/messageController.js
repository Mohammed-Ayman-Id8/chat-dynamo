require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const Message = require('../models/message');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Create a new message
exports.createMessage = (req, res) => {
  const { chatId, body, sender } = req.body;
  const message = new Message(chatId, body, sender);

  const params = {
    TableName: 'Messages',
    Item: message
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Error creating message:', err);
      res.status(500).json({ error: 'Error creating message' });
    } else {
      res.status(201).json(message);
    }
  });
};

// Get a message by messageId
exports.getMessage = (req, res) => {
  const { messageId } = req.params;

  const params = {
    TableName: 'Messages',
    Key: {
      messageId: messageId
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


// Get a messages by chat
exports.getChatMessages = (req, res) => {
  const { messageId } = req.params;

  const params = {
    TableName: 'Messages',
    Key: {
      messageId: messageId
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

// Update a message
exports.updateMessage = (req, res) => {
  const { messageId } = req.params;
  const { body } = req.body;

  const params = {
    TableName: 'Messages',
    Key: {
      messageId: messageId
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
    TableName: 'Messages',
    Key: {
      messageId: messageId
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
