(() => {
  const mongoose = require("mongoose");
  let Room = mongoose.model('Room');
  let User = mongoose.model('User');

  class RoomCtrl {

    addRoom(req, res) {
      let room = new Room({
        name: req.body.name,
        privateRoom: req.body.privateRoom,
        admin: req.body.admin,
        status: "Active"
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

    closeRoom(req, res) {
      Room.findOne({"name" : req.params.name}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          room.status = "Closed";

          User.findOne({"username" :  room.admin}, (err, user) => {

            user.activeRoom = "";

            user.save();

            room.save((err) => {
              res.json({success: true, msg:"Room closed"});
            });
          });

        }

      });
    }

    roomAdmin(req, res) {
      Room.findOne({"name" : req.params.room}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          res.status(200);
          res.json({admin: room.admin});
        }

      });
    }

    joinRoom(req, res) {
      let roomName = req.params.room;
      let userName = req.params.user;

      console.log("Wut m8?");
      console.log(roomName + " " + userName);

      User.findOne({"username" :  userName}, (err, user) => {

        if(err) {
          res.json({success: false, msg:"Error finding room"});
        } else {
          user.activeRoom = roomName;

          user.save((err) => {
            res.json({success: true, msg:"Joined room"});
          });
        }

      });

    }

  };

  module.exports = new RoomCtrl;

})();
