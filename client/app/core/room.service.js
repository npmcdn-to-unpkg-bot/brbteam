(() => {

  angular.module('brbteam')
         .service('RoomService', RoomService);

  RoomService.$inject = [];

  //TODO: we need to write it in and check from the server so the room stays even if you log out or close

  function RoomService() {

    let currRoom = {};

    function getRoomName() {
      return currRoom.name;
    }

    function setRoomName(name) {
      currRoom.name = name;
    }

    function hasActiveRoom() {
      if(currRoom.name)
      {
          return true;
      }

      return false;
    }

    return {
      getRoomName : getRoomName,
      setRoomName : setRoomName,
      hasActiveRoom : hasActiveRoom
    }
  }

})()
