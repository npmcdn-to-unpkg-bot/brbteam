(() => {

  const mongoose = require("mongoose");
  let User = mongoose.model('User');
  let jwt = require('jwt-simple');

  class Auth
  {
    signUp(req, res)
    {

      if(!req.body.username || !req.body.password) {
        res.json({success: false, msg:"Enter username and passowrd"});
      } else {

        let user = new User(req.body);

        user.save((err) => {
          if(err) {
            res.json({success: false, msg:"Username already exists"});
          } else {
            res.json({success: true, msg:"Succesfull login"});
          }
        });
      }
    }

    login(req, res)
    {
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        if (err) throw err;

        if (!user) {
          res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {

              var token = jwt.encode(user, process.env.JWT_SECRET);

              var resObject = { success: true, token: 'JWT ' + token };
              res.json(resObject);
            } else {
              res.send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
          });
        }
      });
    }
  }

  module.exports = new Auth;

})()
