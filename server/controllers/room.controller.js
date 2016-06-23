(() => {
  const mongoose = require("mongoose");
  let Room = mongoose.model('Room');
  let User = mongoose.model('User');

  let exec = require('child_process').exec;
  let fs = require('fs');

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

      console.log(req.params.user);

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

    executeCode(req, res) {

      let currCmd = "";
      let currExt = "";

      let code = req.body.code;
      let type = req.body.type;

      console.log(type);

      if(type == "javascript" ){
        currCmd = 'node ./tmp/hello.js';
        currExt  = ".js";
      } else if (type == "python") {
        currCmd = 'python ./tmp/hello.py';
        currExt  = ".py";
      } else if (type == "ruby") {
        currCmd = 'ruby ./tmp/hello.rb';
        currExt  = ".rb";
      } else if (type == "php") {
        currCmd = 'php ./tmp/hello.php';
        currExt  = ".php";
      }

      console.log(currCmd);

      fs.writeFile("./tmp/hello" + currExt, code, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");

        exec(currCmd, function(error, stdout, stderr) {

          res.status(200);

          if(stdout) {
            res.json({"stdout" : stdout});
          } else {
            res.json({"stdout" : stderr});
          }


        });

    });



    }

  };

  module.exports = new RoomCtrl;

})();
