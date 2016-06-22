(() => {

  const mongoose = require("mongoose");
  let Message = mongoose.model('Message');

  function saveMsg(msg) {
    let message =  new Message({
      data: msg.data,
      name: msg.name,
      room: msg.room,
      date: msg.date,
      state: msg.state
    });

    message.save((err) => {

    });
  }

  module.exports = function(io) {

    let rooms = {};

    io.on('connection', (socket) => {

      // the client send us the room we want to join
      socket.on('room', (data) => {
        socket.join(data.room);
        console.log("Room joined " + data.room);

        // sent to other clients that the person has joined in
        socket.broadcast.to(data.room).emit('adduser', data.user);
      });

      socket.on('msg', (msg) => {
        saveMsg(msg);
        socket.broadcast.to(msg.room).emit('msg', msg);
      });

    });

  }

})();
