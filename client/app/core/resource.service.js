(() => {

  angular.module('brbteam')
         .service('ResourceService', ResourceService);


  ResourceService.$inject = ['$http'];

  function ResourceService($http) {

    const questionApiUrl = "http://localhost:4000/api";

    // Questions
    let addQuestion = (data) => {
      return $http.post(questionApiUrl + '/question/new', data);
    }

    let searchQuestion = (data) => {
      return $http.post(questionApiUrl + '/questions', data);
    }

    let addRoom = (data) => {
      return $http.post('/api/room/new', data);
    }

    let getUser = (name) => {
      return $http.get('/api/user/' + name);
    }

    let updateUser = (name, data) => {
      return $http.put('/api/user/' + name, data);
    }

    return {
      // Questions
      addQuestion : addQuestion,
      searchQuestion : searchQuestion,

      // Rooms
      addRoom : addRoom,

      // Users
      getUser : getUser,
      updateUser : updateUser
    }

  }

})();
