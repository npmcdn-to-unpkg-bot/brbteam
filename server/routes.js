const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.post('/user/signup', authCtrl.signUp);
router.post('/user/login', authCtrl.login);

router.get('/addUser', userCtrl.addUser);
router.get('/user/:name', userCtrl.getUser);
router.put('/user/:name', userCtrl.updateUser);
router.get('/user/:name/room', userCtrl.activeRoom);

router.post('/room/new', roomCtrl.addRoom);
router.get('/room/list', roomCtrl.listRooms);
router.post('/room/:name/close', roomCtrl.closeRoom);
router.put('/room/:room/join/:user', roomCtrl.joinRoom);
router.get('/room/:room/admin', roomCtrl.roomAdmin);

router.get('/messages/:room', messageCtrl.messagesInRoom);

messageCtrl.test;

module.exports = router;
