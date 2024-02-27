const express = require('express');
const usersChatsController = require('../controllers/usersChatsController');

const router = express.Router();

//no need for an api for creating a user chat
// router.post('/', usersChatsController.createUserChat); 
router.get('/:userChatId', usersChatsController.getUserChat);
router.get('/user/:userId', usersChatsController.getUserChatsByUserId);
router.get('/usersByChat/:chat_id', usersChatsController.getUsersByChatId);
router.put('/:userChatId', usersChatsController.updateUserChat);
router.delete('/:userChatId', usersChatsController.deleteUserChat);

module.exports = router;
