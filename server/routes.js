const express = require('express');
const router = express.Router();

// User
require('./models/user.model');
const userCtrl = require('./controllers/user.controller');

// Auth
const authCtrl = require('./controllers/auth.controller');

// Room
require('./models/room.model');
const roomCtrl = require('./controllers/room.controller');

// Message
require('./models/message.model');
const messageCtrl = require('./controllers/message.controller');

router.get('/addUser', userCtrl.addUser);
router.post('/user/signup', authCtrl.signUp);
router.post('/user/login', authCtrl.login);

router.post('/room/new', roomCtrl.addRoom);

module.exports = router;
