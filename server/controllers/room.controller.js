(() => {
  const mongoose = require("mongoose");
  let Room = mongoose.model('Room');

  class RoomCtrl {

    addRoom(req, res)
    {
      let room = new Room({
        name: req.body.name,
        privateRoom: req.body.privateRoom,
        //    admin: currentUser
      });

      room.save((err) => {
        if(err) {
          console.log(err);
        }

        res.json({success: true, msg:"Room created"});

      });

    }
  };

  module.exports = new RoomCtrl;

})();
