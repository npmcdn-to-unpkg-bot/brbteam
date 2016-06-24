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
        status: "Active",
        currTheme: "ambiance",
        currLanguage: "javascript",
        activeVideo: false
      });

      User.findOne({"username" :  req.body.admin}, (err, user) => {

        console.log(req.body.admin);
        user.activeRoom = req.body.name;
        user.save();

        room.interviewies.push(req.body.admin);

        room.save((err) => {
          if(err) {
            console.log(err);
          }

          res.json({success: true, msg:"Room created"});

        });

      });

    };

    listRooms(req, res) {
      Room.find({"privateRoom" : false}, (err, rooms) => {
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

    leaveRoom(req, res) {

      Room.findOne({"name" : req.params.room}, (err, room) => {
        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          let index = room.interviewies.indexOf(req.params.user);

          if(index !== -1) {
            room.interviewies.splice(index, 1);
            room.save();
          }

          User.findOne({"username" :  req.params.user}, (err, user) => {
            if(err) {
              res.json({success: false, msg:"User not found"});
            } else {
              user.activeRoom = "";

              user.save((err) => {
                if(err) {
                  res.json({success: false, msg:"User not saved"});
                } else {
                  res.json({success: true, msg:"User left the room"});
                }
              });
            }

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

      Room.findOne({"name" : req.params.room}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          room.interviewies.push(req.params.user);

          room.save();

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

      });

    }

    usersInRoom(req, res) {
      Room.findOne({"name" : req.params.room}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          res.status(200);
          res.json(room.interviewies);
        }
      });
    }

    updateRoom(req, res) {
      Room.findOne({"name" : req.params.room}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          room.currLanguage = req.body.language;
          room.currTheme = req.body.theme;
          room.activeVideo = req.body.video;

          room.save((err) => {
            if(err) {
              res.json({success: false, msg:"Room not saved"});
            } else {
              res.json({success: true, msg:"Room saved"});
            }
          });
        }
      });
    }

    getRoom(req, res) {
      Room.findOne({"name" : req.params.room}, (err, room) => {

        if(err) {
          res.json({success: false, msg:"Room not found"});
        } else {
          res.status(200);
          res.json(room);
        }
      });
    }

  

  };

  module.exports = new RoomCtrl;

})();
