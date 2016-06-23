(() => {
  const mongoose = require('mongoose');

  let userSchema = require('mongoose').model('User').schema;

  let roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    privateRoom: {type: Boolean, required: true},
    admin: {type: String},
    interviewies: [{type: String}],
    status: {type: String},
    currLanguage: {type: String},
    currTheme: {type: String},
    activeVideo: {type: Boolean}
  });

  mongoose.model('Room', roomSchema);

})();
