
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.calendar', {
            url: "/calendar",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.questions', {
          url: "/questions",
          templateUrl: "views/minor.html",
          data: { pageTitle: 'Example view' }
        })
        .state('index.myroom', {
          url: "/myroom",
          templateUrl: "app/interviewRoom/code_editor.html",
          data: { pageTitle: 'Interview room' }
        })
        .state('index.settings', {
          url: "/settings",
          templateUrl: "views/minor.html",
          data: { pageTitle: 'Example view' }
        });

}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
