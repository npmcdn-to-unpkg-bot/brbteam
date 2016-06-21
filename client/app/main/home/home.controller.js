(() => {
  angular.module('brbteam')
         .controller('HomeController', HomeController);

  HomeController.$inject = ['ResourceService', '$log', '$state', 'RoomService'];

  function HomeController(ResourceService, $log, $state, RoomService) {
    let vm = this;

    // Data
    vm.room = {};

    // Functions
    vm.addRoom = addRoom;


    function addRoom() {

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
  }

})();
