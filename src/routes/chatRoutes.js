const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/', chatController.createChat);
router.get('/', chatController.getChats);
router.get('/user/:user_id', chatController.getUserChats);
router.get('/:chat_id', chatController.getChat);
router.put('/:chat_id', chatController.updateChat);
router.delete('/:chat_id', chatController.deleteChat);

module.exports = router;
