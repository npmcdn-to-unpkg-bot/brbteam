(() => {

  angular.module('inspinia')
         .controller('QuestionsController', QuestionsController);

  //todo user ngInject

  function QuestionsController($scope, $http) {

      $scope.title = "Find the right questions to ask";

      $scope.question = {};

      $scope.addQuestion = () => {

      }
  }

})();
