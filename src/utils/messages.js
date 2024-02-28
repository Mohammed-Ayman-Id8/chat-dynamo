require("dotenv").config();
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.saveMessage = async function (message, res) {
  console.log("message", message);
  const params = {
    TableName: "messages",
    Item: message,
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Error creating message:", err);
      res.status(500).json({ error: "Error creating message" });
    } else {
      res.status(201).json(message);
    }
  });
};
exports.saveMessageWs = async function (message) {
  console.log("message", message);
  const params = {
    TableName: "messages",
    Item: message,
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Error creating message:", err);
      // res.status(500).json({ error: 'Error creating message' });
    } else {
      console.log("message", message);
      // res.status(201).json(message);
    }
  });
};
