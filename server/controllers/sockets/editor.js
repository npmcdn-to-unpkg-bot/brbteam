(() => {

  module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('Connection established');

      socket.on('type', (msg) => {
        console.log(msg);
        socket.broadcast.to(msg.room).emit('type', msg);
      });

      socket.on('consolemsg', (msg) => {
        socket.broadcast.to(msg.room).emit('getconsolemsg', msg);
      });
    });

  }

})()
