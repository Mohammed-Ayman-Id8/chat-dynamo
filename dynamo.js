const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'chats';
const getChats = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const Chats = await dynamoClient.scan(params).promise();
    console.log(Chats)
    return Chats;
};

const getChatById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    const data = await dynamoClient.get(params).promise();
    console.log(data)
    return 
};

const addOrUpdateChat = async (Chat) => {
    const params = {
        TableName: TABLE_NAME,
        Item: Chat,
    };
    return await dynamoClient.put(params).promise();
};

const deleteChat = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    getChats,
    getChatById,
    addOrUpdateChat,
    deleteChat,
};
getChats()
// getChatById('chat_id')