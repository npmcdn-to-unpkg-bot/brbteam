(() => {

  module.exports = function(io) {

    io.on('connection', (socket) => {
      console.log('Connection established');

      socket.on('type', (msg) => {
        console.log(msg);
      });

      // the client send us the room we want to join
      socket.on('room', (room) => {
        socket.join(room);
        console.log("Room joined");
      });

      socket.on('msg', (msg) => {
        console.log("Emiting data " + msg.data + " to room " + msg.room);
        io.sockets.in(msg.room).emit('msg', msg.data);
      });

    });

  }

})();
