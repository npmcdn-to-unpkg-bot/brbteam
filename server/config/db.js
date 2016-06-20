(() => {

  let mongoose = require('mongoose');

  //set up the database
  mongoose.connect("mongodb://localhost/brbteam");

  mongoose.connection.on('connected', () => {
    console.log("Connected to local brbteam database");
  });

})()
