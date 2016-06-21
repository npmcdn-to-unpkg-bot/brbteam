(() => {

  angular.module('brbteam')
         .controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$stateParams', 'RoomService', '$log'];

  function InterviewController(SocketService, $stateParams, RoomService, $log) {
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
    vm.currentCode = "";
    vm.currentMsg = "";

    console.log(vm.currRoomName);

    // Functions
    vm.change = change;
    vm.sendMsg = sendMsg;

    // connect to the current room
    SocketService.on("connect", () => {
      SocketService.emit('room', vm.currRoomName);
    });

    // parse received messages
    SocketService.on("msg", (msg) => {
      $log.info(msg);
    });


    function change()  {
      console.log(vm.currentCode);
      SocketService.emit("type", vm.currentCode);
    }

    function sendMsg() {
      let msg = {};
      msg.room = vm.currRoomName;
      msg.data = vm.currentMsg;

      SocketService.emit('msg', msg);
      $log.info("msg sent to server to send to other clients");
      vm.currentMsg = "";
    }







    // functions
  //  vm.codemirrorLoaded = codemirrorLoaded;

    // function codemirrorLoaded() {
    //   let doc = _editor.getDoc();
    //
    //
    //   _editor.on("change", () => {
    //     console.log(doc);
    //   });
    // }

  }

})();
