const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/chats', chatController.createChat);
router.get('/chats', chatController.getChats);
router.get('/chats/:user_id', chatController.getUserChats);
router.get('/chats/:chat_id', chatController.getChat);
router.put('/chats/:chat_id', chatController.updateChat);
router.delete('/chats/:chat_id', chatController.deleteChat);

module.exports = router;
