(() => {

  angular.module('app.questions')
         .controller('QuestionsController', QuestionsController);

  //todo user ngInject

  function QuestionsController($scope, $http, ResourceService) {

      let vm = this;

      vm.title = "Find the right questions to ask";

      $scope.form = {};

      $scope.addQuestion = () => {
        console.log($scope.form.question);
        console.log($scope.form.tag);

        $scope.form.tags = [];
        $scope.form.tags.push($scope.form.tag);

        ResourceService.addQuestion($scope.form)
        .success((response) =>{
          console.log(response);
        })
        .error((response) => {
          console.log("Error while adding a new question");
        });
      }
  }

})();
