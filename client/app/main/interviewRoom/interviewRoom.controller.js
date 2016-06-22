(() => {

  angular.module('brbteam')
         .controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$state', 'RoomService', '$log', 'AuthService', 'ResourceService', '$scope'];

  function InterviewController(SocketService, $state, RoomService, $log, AuthService, ResourceService, $scope) {
    let vm = this;

    vm.currentUser = AuthService.currentUser().username;

    vm.hasRoom = false;
    vm.isAdmin = false;

    ResourceService.activeRoom(vm.currentUser)
    .success((response) => {
      $log.info(response);
      vm.currRoomName = response.room;
      vm.hasRoom = true;

      if(response.room == undefined || response.room == "") {
        vm.hasRoom = false;
      }

      connectToRoom();
      messagesLoad(vm.currRoomName);

      ResourceService.roomAdmin(vm.currRoomName)
      .success((data) => {
        if(data.admin === vm.currentUser) {
          vm.isAdmin = true;
        }
      });

    })
    .error((response) => {

    });

    // load all msg conversation in the room
    function messagesLoad(room) {
      ResourceService.messagesInRoom(room)
      .success((response) => {
        $log.info(response);
        vm.messages = response;
      })
      .error((response) => {

      });
    }


    // Data
    vm.editorOptions = {
      lineNumbers: true,
      theme:'twilight',
      lineWrapping : true,
       height: 500,
      mode : 'javascript'
    };

    vm.currentCode = "";
    vm.codeEditor = [];
    vm.currentMsg = "";
    vm.messages = [];

    vm.users = [];
    vm.users.push(vm.currentUser);

    console.log(vm.currRoomName);

    // Functions
    vm.change = change;
    vm.sendMsg = sendMsg;
    vm.closeRoom = closeRoom;

    function connectToRoom() {
        // connect to the current room
        if(vm.currRoomName) {
            var roomData = {};
            roomData.room = vm.currRoomName;
            roomData.user = vm.currentUser;

            SocketService.emit('room', roomData);
        }
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

      if(vm.codeEditor[msg.line] == undefined){
        vm.codeEditor[msg.line] = "";
      }

      if(msg.type == "input") {
        vm.codeEditor[msg.line] = vm.codeEditor[msg.line].insertAt(msg.pos, msg.data);
      }
      else if(msg.type == "delete") {
        vm.codeEditor[msg.line] = vm.codeEditor[msg.line].deleteAt(msg.pos-1, 1);
      }


      vm.currentCode = "";
      for(let i = 0; i < vm.codeEditor.length; ++i) {
        vm.currentCode += vm.codeEditor[i] + "\n";
      }

    });

    function change()  {
      // let msg = {};
      // msg.data = vm.currentCode.slice(-1);
      // msg.room = vm.currRoomName;
      //
      // SocketService.emit("type", msg);
    }

    function sendMsg() {
      let msg = {};
      msg.room = vm.currRoomName;
      msg.data = vm.currentMsg;
      msg.name = vm.currentUser;
      msg.date = new Date();
      msg.state = "right";

      vm.messages.push(msg);

      SocketService.emit('msg', msg);
      $log.info("msg sent to server to send to other clients");
      vm.currentMsg = "";
    }

    function closeRoom() {

      ResourceService.closeRoom(vm.currRoomName)
      .success((response) => {
        $log.info("Room closed");
        $state.go('index.main');
      });
    }

    $scope.codemirrorLoaded = function(_editor){

      var _doc = _editor.getDoc();
      _editor.focus();

      _editor.setSize(-1, 470);

      _editor.on("change", function(e, ch){
        console.log(ch);

        let msg = {};
        msg.data = ch.text[0];
        msg.room = vm.currRoomName;
        msg.pos = ch.to.ch;
        msg.line = ch.to.line;

        console.log(msg);
        if(ch.origin == "+input") {
          msg.type = "input";
          SocketService.emit("type", msg);
        }
        else if(ch.origin == "+delete") {
          msg.type = "delete";
          SocketService.emit("type", msg);
        }

      });
    }


  String.prototype.insertAt = function(index, string) {
      return this.substr(0, index) + string + this.substr(index);
    }

  String.prototype.deleteAt = function(s, e) {
    return this.slice(s, e) + this.slice(e + 1);
  }

  let st = "Hello";
  console.log(st.deleteAt(0, 1));

  }

})();
