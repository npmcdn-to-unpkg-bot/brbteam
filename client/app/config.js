
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
            templateUrl: "app/theme/views/common/content.html",
        })
        .state('login', {
            url: "/login",
            controller: 'AuthController',
            controllerAs: 'vm',
            templateUrl: "app/main/auth/login.html"
        })
        .state('register', {
            url: "/register",
            controller: 'AuthController',
            controllerAs: 'vm',
            templateUrl: "app/main/auth/register.html"
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "app/main/home/home.html",
            controller: 'HomeController',
            controllerAs: 'vm',
        })
        .state('index.calendar', {
            url: "/calendar",
            templateUrl: "theme/views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.questions', {
          url: "/questions",
          templateUrl: "app/main/questions/questions.html",
          controller: 'QuestionsController',
          controllerAs: 'vm',
          data: { pageTitle: 'Example view' }
        })
        .state('index.myroom', {
          url: "/myroom/:roomname",
          templateUrl: "app/main/interviewRoom/code_editor.html",
          controller: 'InterviewController',
          controllerAs: 'vm',
          data: { pageTitle: 'Interview room' }
        })
        .state('index.settings', {
          url: "/settings",
          controller: 'SettingsController',
          controllerAs: 'vm',
          templateUrl: "app/main/settings/settings.html",
        });

}
angular
    .module('brbteam')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
