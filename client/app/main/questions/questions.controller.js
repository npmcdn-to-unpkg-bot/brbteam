(() => {

  angular.module('brbteam')
         .controller('QuestionsController', QuestionsController);

  //todo user ngInject

  function QuestionsController($http, ResourceService) {

      let vm = this;

      // Functions
      vm.addQuestion = addQuestion;
      vm.searchQuestion = searchQuestion;

      // Data
      vm.title = "Find the right questions to ask";
      vm.form = {};
      vm.search = {};

      function addQuestion() {
        console.log(vm.form.question);
        console.log(vm.form.tag);

        vm.form.tags = [];
        vm.form.tags.push(vm.form.tag);

        ResourceService.addQuestion(vm.form)
        .success((response) => {
          console.log(response);
          vm.form.tag = "";
          vm.form.question = "";
        })
        .error((response) => {
          console.log("Error while adding a new question");
        });
      }

      function searchQuestion() {
        console.log(vm.search.tags);

        ResourceService.searchQuestion(vm.search)
        .success((response) => {
          vm.foundQuestions = response;
        })
        .error((response) => {
          console.log("Error while searching questions");
        });

      }


  }

})();
