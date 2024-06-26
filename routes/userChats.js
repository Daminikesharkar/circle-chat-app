const express = require('express');

const userChatsController = require('../controllers/userChats');
const authentication = require('../middleware/authentication');
const { multer: upload } = require('../middleware/multerconfig');

const router = express.Router();

router.get('/userChats',userChatsController.getUserChatPage);
router.post('/postMessage',authentication.authenticate,userChatsController.saveChats);
router.post('/postImage',authentication.authenticate,upload.single('image'),userChatsController.saveImageChat);
router.get('/getMessages',authentication.authenticate,userChatsController.getChats);
router.get('/getAllUsers',authentication.authenticate,userChatsController.getUsers);
router.get('/getGroupUsers',authentication.authenticate,userChatsController.getGroupUsers);
router.get('/getRemainingUsers',authentication.authenticate,userChatsController.getRemainingUsers);
router.post('/makeAdmin',authentication.authenticate,userChatsController.makeAdmin);
router.post('/updateGroup',authentication.authenticate,userChatsController.updateGroup);
router.post('/removeUserFromGroup',authentication.authenticate,userChatsController.removeUserFromGroup);

router.post('/createGroup',authentication.authenticate,userChatsController.createGroup);
router.get('/getUserGroups',authentication.authenticate,userChatsController.getUserGroups);
router.get('/checkAdmin',authentication.authenticate,userChatsController.checkAdmin);
router.get('/getGroupMessages',authentication.authenticate,userChatsController.getGroupChats);

module.exports = router;