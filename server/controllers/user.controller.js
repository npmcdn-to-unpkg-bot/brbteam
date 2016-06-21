(() => {

  const mongoose = require("mongoose");
  let User = mongoose.model('User');

  class UserCtrl {

    constructor() {}

    addUser(req, res) {
      let currUser = new User({
        firstName: "sfds",
        lastName: "sdfd",
        username: "sdfds",
        email: "sdfds",
      });

      currUser.save((err) => {
        if(err) {
          console.log("Error while saving user");
        }

        res.status(200);
        res.json(true);
      });

    };

    getUser(req, res) {
      console.log(req.params.name);
      User.find({"username" : req.params.name}, (err, user) => {
        if(err) {
          res.json({success: false, msg:"User not found"});
        } else {
          res.json({success: true, msg: user});
        }

      })
    };

    updateUser(req, res) {
      User.findOne({"username" : req.params.name}, (err, user) => {

        if(err) {

        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.companyName = req.body.companyName;
          user.industry = req.body.industry;

          user.save();
        }

      });
    }

  };


  module.exports = new UserCtrl;

})();
