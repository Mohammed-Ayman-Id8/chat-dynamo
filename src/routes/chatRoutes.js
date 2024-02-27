const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/', chatController.getChats);
router.get('/:chatId', chatController.getChat);
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;
