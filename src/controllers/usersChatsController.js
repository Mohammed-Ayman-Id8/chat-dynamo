require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get a userchat by userChatId
exports.getUserChat = (req, res) => {
  const { userChatId } = req.params;
  const params = {
    TableName: 'usersChats',
    Key: {
      user_chat_id: userChatId
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
// Get user chats by user ID
exports.getUserChatsByUserId = async (req, res) => {
  try {
    console.log("req params",req.params)
    const user_id = req.params.userId;
    const params = {
      TableName: 'usersChats',
      IndexName: 'user_id-index',
      KeyConditionExpression: 'user_id = :id',
      ExpressionAttributeValues: {
        ':id': user_id
      }
    };

    const result = await dynamodb.query(params).promise();
    res.send(result);
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).send('Error getting user chats');
  }
};
// Get users by chat ID
exports.getUsersByChatId = async (req, res) => {
  try {
    const chat_id = req.params.chatId;
    const params = {
      TableName: 'usersChats',
      IndexName: 'chat_id-index',
      KeyConditionExpression: 'chat_id = :id',
      ExpressionAttributeValues: {
        ':id': chat_id
      }
    };

    const result = await dynamodb.query(params).promise();
    res.send(result);
  } catch (error) {
    console.error('Error getting users by chat ID:', error);
    res.status(500).send('Error getting users by chat ID');
  }
};
// Delete a userChat
exports.deleteChat = (req, res) => {
  const { chat_id } = req.params;

  const params = {
    TableName: 'usersChats',
    Key: {
      user_chat_id: chat_id
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