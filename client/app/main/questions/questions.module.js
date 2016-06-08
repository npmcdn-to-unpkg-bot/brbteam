(() => {
  'use strict';

  angular.module('app.questions', ['app.core'])
         .config(config);

  function config($stateProvider) {

    $stateProvider
      .state('index.questions', {
        url: "/questions",
        templateUrl: "app/main/questions/questions.html",
        controller: 'QuestionsController',
        controllerAs: 'vm'
      });

  }
})();
