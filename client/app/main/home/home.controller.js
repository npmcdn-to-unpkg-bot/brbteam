(() => {
  angular.module('brbteam')
         .controller('HomeController', HomeController);

  HomeController.$inject = ['ResourceService', '$log', '$state', 'RoomService', 'AuthService'];

  function HomeController(ResourceService, $log, $state, RoomService, AuthService) {
    let vm = this;

    // Data
    vm.room = {};
    vm.roomsList = [];
    vm.currUser = AuthService.currentUser().username;

    // Functions
    vm.addRoom = addRoom;
    vm.joinRoom = joinRoom;

    ResourceService.listRooms()
    .success((data) => {
      vm.roomsList = data;
    });

    function addRoom() {

      if(vm.room.privateRoom == undefined) {
        vm.room.privateRoom = false;
      }

      vm.room.admin = vm.currUser;

      ResourceService.addRoom(vm.room)
      .success((response) => {
        $log.info(response);
        RoomService.setRoomName(vm.room.name);
        vm.room = {};
        $state.go('index.myroom');

      })
      .error((response) => {
        $log.info(response);
      });
    }

    function joinRoom(roomName) {
      ResourceService.joinRoom(vm.currUser, roomName)
      .success((response) => {
        $log.info("joined the room");
        $state.go('index.myroom');
      })
      .error((response) => {
        $log.info("Error joining room");
      });
    }
  }

})();
