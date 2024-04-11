const express = require('express');

const userChatsController = require('../controllers/userChats');
const authentication = require('../middleware/authentication');

const router = express.Router();

router.get('/userChats',userChatsController.getUserChatPage);
router.post('/postMessage',authentication.authenticate,userChatsController.saveChats);

module.exports = router;