(() => {

  angular.module('brbteam')
         .controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$stateParams'];

  function InterviewController(SocketService, $stateParams) {
    let vm = this;

    // Data
    vm.editorOptions = {
      lineNumbers: true,
      theme:'rubyblue',
      lineWrapping : true,
       height: 500,
      mode : 'javascript'
    };

    vm.currRoomName = $stateParams.roomname;
    vm.currentCode = "";

    console.log(vm.currRoomName);

    // Functions
    vm.change = change;

    function change()  {
      console.log(vm.currentCode);
      SocketService.emit("type", vm.currentCode);
    }

    // functions
  //  vm.codemirrorLoaded = codemirrorLoaded;

    // function codemirrorLoaded() {
    //   let doc = _editor.getDoc();
    //
    //
    //   _editor.on("change", () => {
    //     console.log(doc);
    //   });
    // }

  }

})();
