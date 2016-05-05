var express = require('express');
var app = express();

app.use(express.static('client'));

app.listen(9000, function() {
  console.log("App is listening on port 9000");
});
