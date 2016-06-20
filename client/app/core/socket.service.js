(() => {

  angular.module('brbteam')
         .service('SocketService', SocketService);

  SocketService.$inject = ['socketFactory'];

  function SocketService(socketFactory) {
    return socketFactory();
  }

})()
