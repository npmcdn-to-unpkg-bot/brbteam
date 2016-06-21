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

    let listRooms = () => {
      return $http.get('/api/room/list');
    }

    let closeRoom = (name) => {
      return $http.post('/api/room/' + name + "/close");
    }

    let joinRoom = (user, room) => {
      return $http.post('/api/room/' + room + "/join/" + user);
    }

    let getUser = (name) => {
      return $http.get('/api/user/' + name);
    }

    let updateUser = (name, data) => {
      return $http.put('/api/user/' + name, data);
    }

    let activeRoom = (name) => {
      return $http.get('/api/user/' + name + "/room");

    }

    return {
      // Questions
      addQuestion : addQuestion,
      searchQuestion : searchQuestion,

      // Rooms
      addRoom : addRoom,
      listRooms : listRooms,
      closeRoom : closeRoom,
      joinRoom : joinRoom,

      // Users
      getUser : getUser,
      updateUser : updateUser,
      activeRoom : activeRoom
    }

  }

})();
