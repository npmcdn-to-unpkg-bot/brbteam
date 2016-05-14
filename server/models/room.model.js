(() => {
  const mongoose = require('mongoose');

  let userSchema = require('mongoose').model('User').schema;

  let roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    privateRoom: {type: Boolean, required: true},
    admin: {userSchema},
    interviewies: [userSchema]
  });

  mongoose.model('Room', roomSchema);

})();
