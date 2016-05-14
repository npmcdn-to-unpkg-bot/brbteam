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
  };


  module.exports = new UserCtrl;

})();
