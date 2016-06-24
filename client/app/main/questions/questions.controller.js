(() => {

  angular.module('brbteam')
         .controller('QuestionsController', QuestionsController);

  QuestionsController.$inject = ['$http', 'ResourceService', '$scope', 'toastr'];

  function QuestionsController($http, ResourceService, $scope, toastr) {

      let vm = this;

      $scope.availableColors = [{color:"Blue"}, {color:"Red"}];

      $scope.multipleDemo = {};
    $scope.multipleDemo.colors = [];
      // Functions
      vm.addQuestion = addQuestion;
      vm.searchQuestion = searchQuestion;
      vm.addTag = addTag;
      vm.addSearchTag = addSearchTag;

      // Data
      vm.title = "Find the right questions to ask";
      vm.form = {};
      vm.search = {};

      vm.addedTags = [];
      vm.addedSearchTags = [];
      vm.newTag = "";
      vm.newSearchTag = "";

      function addQuestion() {
        console.log(vm.form.question);
        console.log(vm.form.tag);

        vm.form.tags = vm.addedTags;

        ResourceService.addQuestion(vm.form)
        .success((response) => {
          console.log(response);
          vm.form.tag = "";
          vm.form.question = "";
          vm.addedTags = [];
          toastr.success("Question added");
        })
        .error((response) => {
          console.log("Error while adding a new question");
        });
      }

      function searchQuestion() {

        vm.search.tags = vm.addedSearchTags;

        vm.searchedTags = angular.copy(vm.addedSearchTags);

        ResourceService.searchQuestion(vm.search)
        .success((response) => {
          vm.foundQuestions = response;
          vm.addedSearchTags = [];
        })
        .error((response) => {
          console.log("Error while searching questions");
        });

      }

      function addTag() {
        vm.addedTags.push(vm.newTag);
        vm.newTag = "";
      }

      function addSearchTag() {
        vm.addedSearchTags.push(vm.newSearchTag);
        vm.newSearchTag = "";
      }


  }

})();
