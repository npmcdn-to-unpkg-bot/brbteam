(() => {
  const mongoose = require("mongoose");
  let Room = mongoose.model('Room');
  let User = mongoose.model('User');

  class RoomCtrl {

    addRoom(req, res) {
      let room = new Room({
        name: req.body.name,
        privateRoom: req.body.privateRoom,
        admin: req.body.admin
      });

      User.findOne({"username" :  req.body.admin}, (err, user) => {

        console.log(req.body.admin);
        user.activeRoom = req.body.name;
        user.save();

        room.save((err) => {
          if(err) {
            console.log(err);
          }

          res.json({success: true, msg:"Room created"});

        });

      });

    };

    listRooms(req, res) {
      Room.find({}, (err, rooms) => {
        if(err) {
          res.json({success: false, msg:"Rooms not found"});
        } else {
          res.status(200);
          res.json(rooms);
        }


      });
    }

  };

  module.exports = new RoomCtrl;

})();
