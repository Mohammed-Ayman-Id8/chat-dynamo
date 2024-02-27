const express = require('express');
const usersChatsController = require('../controllers/usersChatsController');

const router = express.Router();

router.get('/:userChatId', usersChatsController.getUserChat);
router.get('/user/:userId', usersChatsController.getUserChatsByUserId);
router.get('/usersByChat/:chatId', usersChatsController.getUsersByChatId);
// router.delete('/:userChatId', usersChatsController.deleteUserChat);

module.exports = router;
