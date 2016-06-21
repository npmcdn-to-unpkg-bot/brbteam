(() => {
  const mongoose = require("mongoose");
  let Message = mongoose.model('Message');

  class MessageCtrl {

    messagesInRoom(req, res) {
      Message.find({"room" : req.params.room}, (err, msgs) => {
        if(err) {
          res.json({success: false, msg:"Chatroom messages not found"});
        } else {
          res.status(200);
          res.json(msgs);
        }
      });
    }
  };

  module.exports = new MessageCtrl;

})();
