(() => {
  const mongoose = require('mongoose');

  let userSchema = require('mongoose').model('User').schema;
  let roomSchema = require('mongoose').model('Room').schema

  let messageSchema = new mongoose.Schema({
    text: {type: String, required: true},
    from: userSchema,
    chatRoom: roomSchema,
    time: {type: Date, default: Date.now}
  });

  mongoose.model('Message', messageSchema);

})();
