const express = require('express');

const userChatsController = require('../controllers/userChats');
const authentication = require('../middleware/authentication');

const router = express.Router();

router.get('/userChats',userChatsController.getUserChatPage);
router.post('/postMessage',authentication.authenticate,userChatsController.saveChats);
router.get('/getMessages',authentication.authenticate,userChatsController.getChats);
router.get('/getAllUsers',authentication.authenticate,userChatsController.getUsers);

router.post('/createGroup',authentication.authenticate,userChatsController.createGroup);
router.get('/getUserGroups',authentication.authenticate,userChatsController.getUserGroups);
router.get('/checkAdmin',authentication.authenticate,userChatsController.checkAdmin);

module.exports = router;