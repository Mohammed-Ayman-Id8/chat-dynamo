const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/chats', chatController.createChat);
router.get('/chats', chatController.getChats);
router.get('/chats/user/:userId', chatController.getUserChats);
router.get('/chats/:chatId', chatController.getChat);
router.put('/chats/:chatId', chatController.updateChat);
router.delete('/chats/:chatId', chatController.deleteChat);

module.exports = router;
