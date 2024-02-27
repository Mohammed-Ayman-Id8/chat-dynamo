require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


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
      res.status(204).send("Deleted successfully");
    }
  });
};
