const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/messages', messageController.createMessage);
router.get('/messages/:chatId', messageController.getChatMessages);
router.get('/messages/:messageId', messageController.getMessage);
router.put('/messages/:messageId', messageController.updateMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);

module.exports = router;
