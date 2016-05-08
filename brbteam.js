var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

import router from "./server/routes.js";

let port = process.env.PORT || 9000;

//set up the database
mongoose.connect("mongodb://localhost/brbteam");

mongoose.connection.on('connected', () => {
  console.log("Connected to local brbteam database");
});

//include the client side
app.use(express.static('client'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, function() {
  console.log("App is listening on port " + port);
});
