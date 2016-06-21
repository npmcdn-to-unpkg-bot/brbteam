(() => {
  require('dotenv').load();

  let express = require('express');
  let app = express();
  let bodyParser = require('body-parser');
  let mongoose = require('mongoose');
  let db = require('./server/config/db.js');
  let jwt = require('jwt-simple');
  let chat = require('./server/controllers/sockets/chat.js');
  let editor = require('./server/controllers/sockets/editor.js');

  let router = require("./server/routes.js");

  let passport = require('passport');
  require('./server/config/passport.js')(passport);

  let port = process.env.PORT || 9000;

  //include the client side
  app.use(express.static('client'));

  app.use(bodyParser.urlencoded({extended : true}));
  app.use(bodyParser.json());

  app.use('/api', router);

  let server = app.listen(port, function() {
    console.log("App is listening on port " + port);
  });

  let io = require('socket.io').listen(server);

  chat(io);
  editor(io);

})()
