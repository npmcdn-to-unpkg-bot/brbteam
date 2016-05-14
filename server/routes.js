const express = require('express');
const router = express.Router();

//import all of the models and controllers
require('./models/user.model');
const userCtrl = require('./controllers/user.controller');

require('./models/room.model');
const roomCtrl = require('./controllers/room.controller');

require('./models/message.model');
const messageCtrl = require('./controllers/message.controller');

router.get('/hi', function(req, res) {
  res.send("Hi you hit the api");
});

router.get('/addUser', userCtrl.addUser);

module.exports = router;
