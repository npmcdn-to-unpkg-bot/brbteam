(() => {

  const mongoose = require("mongoose");

  let userSchema = new mongoose.Schema({
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      username: {type: String, required: true},
      email: {type: String, required: true},
      hash: String,
      salt: String
  });

  module.exports = mongoose.model('User', userSchema);

})();
