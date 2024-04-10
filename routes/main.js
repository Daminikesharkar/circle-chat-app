const express = require('express');

const mainController = require('../controllers/main')

const router = express.Router();

router.get('/',mainController.getIndex);
router.post('/addUser',mainController.postUser);
router.post('/login',mainController.login);

module.exports = router;