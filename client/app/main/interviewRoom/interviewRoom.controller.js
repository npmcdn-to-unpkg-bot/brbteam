(() => {

  angular.module('brbteam')
         .controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$stateParams', 'RoomService', '$log', 'AuthService'];

  function InterviewController(SocketService, $stateParams, RoomService, $log, AuthService) {
    let vm = this;

    // Data
    vm.editorOptions = {
      lineNumbers: true,
      theme:'twilight',
      lineWrapping : true,
       height: 500,
      mode : 'javascript'
    };

    vm.hasRoom = RoomService.hasActiveRoom();
    vm.currRoomName = RoomService.getRoomName();
    vm.currentUser = AuthService.currentUser().username;
    vm.currentCode = "";
    vm.currentMsg = "";
    vm.messages = [];

    vm.users = [];
    vm.users.push(vm.currentUser);

    console.log(vm.currRoomName);

    // Functions
    vm.change = change;
    vm.sendMsg = sendMsg;

    // connect to the current room
      if(vm.currRoomName) {
          var roomData = {};
          roomData.room = vm.currRoomName;
          roomData.user = vm.currentUser;

          SocketService.emit('room', roomData);
      }


    // parse received messages
    SocketService.on("msg", (msg) => {
      $log.info(msg);
      msg.state = "left";
      vm.messages.push(msg);
    });

    // When a user has joined the room
    SocketService.on("adduser", (user) => {
      vm.users.push(user);
    });

    // We are getting what the user typed into the code editor
    SocketService.on("type", (msg) => {
      $log.info(msg.data);
      vm.currentCode = msg.data;
    });

    function change()  {
      let msg = {};
      msg.data = vm.currentCode;
      msg.room = vm.currRoomName;

      SocketService.emit("type", msg);
    }

    function sendMsg() {
      let msg = {};
      msg.room = vm.currRoomName;
      msg.data = vm.currentMsg;
      msg.name = vm.currentUser;
      msg.date = new Date();
      msg.state = "right";

      $log.info(msg);

      vm.messages.push(msg);

      SocketService.emit('msg', msg);
      $log.info("msg sent to server to send to other clients");
      vm.currentMsg = "";
    }


  }

})();
