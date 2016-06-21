(() => {
  const mongoose = require('mongoose');

  let userSchema = require('mongoose').model('User').schema;
  let roomSchema = require('mongoose').model('Room').schema

  let messageSchema = new mongoose.Schema({
    data: {type: String, required: true},
    name: {type: String, required: true},
    room: {type: String, required: true},
    date: {type: Date, default: Date.now},
    state: {type: String}
  });

  mongoose.model('Message', messageSchema);

})();
