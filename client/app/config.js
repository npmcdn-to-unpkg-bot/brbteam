( () => {
  angular.module('app')
  .config(config);

  function config($stateProvider) {
    'use strict';

    (function () {
      'use strict';

      angular.module('app.questions', ['app.core']).config(config);

      function config($stateProvider) {

        $stateProvider.state('index.main', {
          url: "/",
          templateUrl: "app/main/questions/questions.html",
        //  controller: 'QuestionsController',
        //  controllerAs: 'vm'
        });
      }
    })();
  }

})();
