(() => {

  angular.module('inspinia')
         .controller('InterviewController', InterviewController);

  function InterviewController($scope) {

    let vm = this;

    vm.hi =  "HI";
    // data
    vm.editorOptions = {
      lineNumbers: true,
      theme:'twilight',
      lineWrapping : true,
      mode : 'javascript'
    };

    vm.currentCode = "";

    vm.change = () => {
      console.log(vm.currentCode);
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
