(() => {

  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");

  //let roomSchema = require('mongoose').model('Room').schema

  let userSchema = new mongoose.Schema({
      firstName: {type: String},
      lastName: {type: String},
      username: {type: String, required: true},
      email: {type: String, required: true},
      password: {type: String, required: true},
      role: {type: String},
      companyName: {type: String},
      industry: {type: String},
      activeRoom: {type: String}
  });

  userSchema.pre('save', function(next)  {
    let user = this;

    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, (err, salt) => {
          if (err) {
              return next(err);
          }

          bcrypt.hash(user.password, salt, function (err, hash) {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              next();
          });
      });
    } else {
        return next();
    }
  });

  userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
          cb(null, isMatch);
      });
  };

  module.exports = mongoose.model('User', userSchema);

})();
