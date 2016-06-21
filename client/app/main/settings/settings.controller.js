(() => {

  angular.module('brbteam')
         .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['ResourceService', '$log', 'AuthService'];

  function SettingsController(ResourceService, $log, AuthService) {
    let vm = this;

    // Data
    vm.userSettings = {};
    vm.username = AuthService.currentUser().username;

    ResourceService.getUser(vm.username)
    .success((data) => {
      $log.info(data);
      vm.userSettings = data.msg[0];
    });


    // Functions
    vm.saveUser = saveUser;

    function saveUser() {
      $log.info(vm.userSettings);

      ResourceService.updateUser(vm.username, vm.userSettings)
      .success((response) => {
        $log.info("User updated");
        alert("Updated");
      })
      .error((response) => {
        $log.info("Error while updating user");
      });
    }


  }

})()
