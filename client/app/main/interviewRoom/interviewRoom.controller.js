(() => {

  angular.module('brbteam')
         .controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$state', 'RoomService', '$log', 'AuthService', 'ResourceService', '$scope', 'ngAudio', 'toastr'];

  function InterviewController(SocketService, $state, RoomService, $log, AuthService, ResourceService, $scope, ngAudio, toastr) {
    let vm = this;

    vm.currentUser = AuthService.currentUser().username;

    vm.hasRoom = false;
    vm.isAdmin = false;
    vm.rtcSwitch = false;
    vm.users = [];
    vm.openChat = false;
    vm.unseenMsgs = 0;

    let editor = null;

    vm.languages = ["javascript", "ruby", "python", "php"];
    vm.selectedLang = "javascript";
    vm.selectedTheme = "ambiance";

    vm.msgSound = ngAudio.load("assets/msg2.mp3");

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

      ResourceService.getRoom(vm.currRoomName)
      .success((response) => {
          vm.selectedLang = response.currLanguage;
          vm.selectedTheme = response.currTheme;
      });

      ResourceService.usersInRoom(vm.currRoomName)
      .success((response) => {

        angular.forEach(response, (v, k) => {
          if(vm.users.indexOf(v) === -1) {
            vm.users.push(v);
          }

        });
      });

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
      theme: vm.selectedTheme,
      lineWrapping : true,
       height: 500,
      mode : 'ruby'
    };

    vm.currentCode = "";
    vm.codeEditor = [];
    vm.currentMsg = "";
    vm.messages = [];
    vm.consoleMessages = [];

    // Functions
    vm.sendMsg = sendMsg;
    vm.closeRoom = closeRoom;
    vm.changeTheme =  changeTheme;
    vm.changeMode = changeMode;
    vm.runCode = runCode;
    vm.leaveRoom = leaveRoom;
    vm.changeChatState = changeChatState;

    vm.enableCamera = () => { loadWebRtc(); }

    function loadWebRtc() {
      var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotesVideos',
        // immediately ask for camera access
        autoRequestMedia: true
      });


      webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom(vm.currRoomName);
      });
    }

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
      if(vm.openChat == false) {
        vm.unseenMsgs++;
      }
      vm.msgSound.play();
      msg.state = "left";
      vm.messages.push(msg);
    });

    // When a user has joined the room
    SocketService.on("adduser", (user) => {
      if(vm.users.indexOf(user) === -1) {
        vm.users.push(user);
      }

    });

    SocketService.on('leftroom', (msg) => {
      let index = vm.users.indexOf(msg.user);

      if(index !== -1) {
        vm.users.splice(index, 1);
      }
    });

    SocketService.on('getconsolemsg', (msg) => {
      vm.consoleMessages.push(msg.data);
    });

    SocketService.on('change_mode', (msg) => {
      vm.selectedLang = msg.mode;
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
        vm.codeEditor[msg.line] = vm.codeEditor[msg.line].deleteAt(msg.pos - 1);
      }


      vm.currentCode = "";
      for(let i = 0; i < vm.codeEditor.length; ++i) {
        vm.currentCode += vm.codeEditor[i] + "\n";
      }

    });

    function changeTheme(theme)  {
      editor.setOption('theme', theme);
      vm.selectedTheme = theme;
      updateRoom();
    }

    function changeMode() {
      let mode = vm.selectedLang;

      if(vm.selectedLang == 'c#' || vm.selectedLang == 'c++' || vm.selectedLang == 'java') {
        mode = "clike";
      }

      updateRoom();
      editor.setOption('mode', mode);

      let msg = {};
      msg.room = vm.currRoomName;
      msg.mode = mode;

      SocketService.emit('mode_changed', msg);
    }

    function leaveRoom() {
      ResourceService.leaveRoom(vm.currentUser, vm.currRoomName)
      .success((response) => {
        SocketService.emit('leftroom', {"user" : vm.currentUser, "room" : vm.currRoomName});
        $state.go("index.main");
      })
      .error((response) => {
        $log.info("Failed to leave the room");
      });
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
      vm.currentMsg = "";
    }

    function closeRoom() {

      ResourceService.closeRoom(vm.currRoomName)
      .success((response) => {
        $log.info("Room closed");
        $state.go('index.main');
      });
    }

    function runCode(req, res) {

        let data = {};
        data.code = vm.currentCode;
        data.type = vm.selectedLang;
        $log.info(data);

        ResourceService.executeCode(data)
        .success((response) => {
          let msg = {};
          msg.room = vm.currRoomName;
          msg.data = response.stdout;
          vm.consoleMessages.push(response.stdout);
          SocketService.emit('consolemsg', msg);
        });

    }

    $scope.codemirrorLoaded = function(_editor){

      var _doc = _editor.getDoc();
      _editor.focus();

      _editor.setSize(-1, 470);

      editor = _editor;

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

    function changeChatState() {
      vm.openChat = !vm.openChat;
      vm.unseenMsgs = 0;
    }

    function updateRoom() {
      let room = {};
      room.language = vm.selectedLang;
      room.theme = vm.selectedTheme;
      room.video = false;

      ResourceService.updateRoom(vm.currRoomName, room)
      .success((err) => {
        $log.info("Room updated");
      });
    }



  String.prototype.insertAt = function(index, string) {
      return this.substr(0, index) + string + this.substr(index);
    }

  String.prototype.deleteAt = function(pos) {
    //return this.slice(s, e) + this.slice(e + 1);
    return this.slice(0, pos) + this.slice(pos + 1, this.length);
  }


  }

})();
