(() => {

  angular.module('brbteam').
        controller('MainController', MainController);

  MainController.$inject = ['AuthService'];

  function MainController(AuthService) {
    let vm = this;

    // Data
    if(AuthService.currentUser() !== undefined) {
      vm.userName = AuthService.currentUser().username;
    }



    // Functions
    vm.logout = logout;

    function logout() {
      AuthService.logout();
    }

  }

})()
