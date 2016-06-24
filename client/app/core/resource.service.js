(() => {

  angular.module('brbteam')
         .service('ResourceService', ResourceService);


  ResourceService.$inject = ['$http'];

  function ResourceService($http) {

    const questionApiUrl = "http://localhost:4000/api";
    const codeApiUrl = "http://localhost:3000/api";

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
      return $http.put('/api/room/' + room + "/join/" + user);
    }

    let leaveRoom = (user, room) => {
      return $http.put('/api/room/' + room + "/leave/" + user);
    }

    let usersInRoom = (room) => {
      return $http.get('/api/room/' + room + "/users");
    }

    let getRoom = (room) => {
      return $http.get('/api/room/' + room);
    }

    let updateRoom = (room, data) => {
      return $http.put('/api/room/' + room + "/update", data);
    }

    let roomAdmin = (room) => {
      return $http.get('/api/room/' + room + "/admin");
    }

    let executeCode = (data) => {
      return $http.post(codeApiUrl  + '/code/execute', data);
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

    let messagesInRoom = (room) => {
      return $http.get('/api/messages/' + room);
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
      leaveRoom : leaveRoom,
      getRoom : getRoom,
      updateRoom : updateRoom,
      usersInRoom : usersInRoom,
      roomAdmin : roomAdmin,
      executeCode : executeCode,

      // Users
      getUser : getUser,
      updateUser : updateUser,
      activeRoom : activeRoom,

      // Messages
      messagesInRoom : messagesInRoom
    }

  }

})();
