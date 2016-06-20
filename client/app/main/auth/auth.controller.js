(() => {

  angular.module('brbteam')
         .controller('AuthController', AuthController);

  function AuthController(AuthService, $log) {
    let vm = this;

    // Data
    vm.signupData = {};
    vm.loginData = {};

    // Functions
    vm.login = login;
    vm.signup = signup;

    function login() {
      AuthService.login(vm.loginData, (success) => {
        if(success) {
          $log.info('Succesfull login');
        } else {
          $log.info('Login failed');
        }
      });
    }

    function signup() {

      AuthService.signup(vm.signupData, (success) => {
        if(success) {
          $log.info('Succesfull signup');
        } else {
          $log.info('Signup failed');
        }
      });

    }

  }

})()
