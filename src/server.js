require('dotenv').config();
const express= require("express");
const cors =require("cors");
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 8000;

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// app.use(cors());

app.use(bodyParser.json());
app.use('/', chatRoutes);
// app.use('/api/messages', messageRoutes);

const server = app.listen(port, async () => {
  console.log(`App running on http://localhost:${port}`);
});

module.exports = server;

