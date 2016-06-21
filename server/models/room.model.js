(() => {
  const mongoose = require('mongoose');

  let userSchema = require('mongoose').model('User').schema;

  let roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    privateRoom: {type: Boolean, required: true},
    admin: {type: String},
    interviewies: [userSchema],
    status: {type: String}
  });

  mongoose.model('Room', roomSchema);

})();
