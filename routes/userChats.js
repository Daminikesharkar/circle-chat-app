const express = require('express');

const userChatsController = require('../controllers/userChats')

const router = express.Router();

router.get('/userChats',userChatsController.getUserChatPage);

module.exports = router;