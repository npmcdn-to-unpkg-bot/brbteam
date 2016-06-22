(() => {

  angular.module('brbteam').
        controller('MainController', MainController);

  MainController.$inject = ['AuthService', 'ResourceService'];

  function MainController(AuthService, ResourceService) {
    let vm = this;

    // Data
    if(AuthService.currentUser() !== undefined) {
      vm.userName = AuthService.currentUser().username;
    }

    ResourceService.activeRoom(vm.userName)
    .success((response) => {
      vm.roomName = response.room;
    });

    // Functions
    vm.logout = logout;

    function logout() {
      AuthService.logout();
    }

  }

})()
