(() => {

  angular.module('brbteam')
         .controller('AuthController', AuthController);

  AuthController.$inject = ['AuthService', '$log', 'toastr'];

  function AuthController(AuthService, $log, toastr) {
    let vm = this;

    // Data
    vm.signupData = {};
    vm.loginData = {};

    // Functions
    vm.login = login;
    vm.signup = signup;

    function login() {
      AuthService.login(vm.loginData, (success, msg) => {
        if(success) {
          $log.info('Succesfull login');
        } else {
          toastr.error(msg, 'Error');
        }
      });
    }

    function signup() {

      AuthService.signup(vm.signupData, (success, msg) => {
        if(success) {
          $log.info('Succesfull signup');
        } else {
            toastr.error(msg, 'Error');
        }
      });

    }

  }

})()
