'use strict';

(function () {
    angular.module('brbteam', ['ui.router', // Routing
    'oc.lazyLoad', // ocLazyLoad
    'ui.bootstrap', // Ui Bootstrap
    'ui.codemirror', 'angular-jwt', 'ngStorage', 'btford.socket-io']);
})();
"use strict";

function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider.state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/theme/views/common/content.html"
    }).state('login', {
        url: "/login",
        controller: 'AuthController',
        controllerAs: 'vm',
        templateUrl: "app/main/auth/login.html"
    }).state('register', {
        url: "/register",
        controller: 'AuthController',
        controllerAs: 'vm',
        templateUrl: "app/main/auth/register.html"
    }).state('index.main', {
        url: "/main",
        templateUrl: "app/main/home/home.html",
        controller: 'HomeController',
        controllerAs: 'vm'
    }).state('index.calendar', {
        url: "/calendar",
        templateUrl: "theme/views/minor.html",
        data: { pageTitle: 'Example view' }
    }).state('index.questions', {
        url: "/questions",
        templateUrl: "app/main/questions/questions.html",
        controller: 'QuestionsController',
        controllerAs: 'vm',
        data: { pageTitle: 'Example view' }
    }).state('index.myroom', {
        url: "/myroom/:roomname",
        templateUrl: "app/main/interviewRoom/code_editor.html",
        controller: 'InterviewController',
        controllerAs: 'vm',
        data: { pageTitle: 'Interview room' }
    }).state('index.settings', {
        url: "/settings",
        controller: 'SettingsController',
        controllerAs: 'vm',
        templateUrl: "app/main/settings/settings.html"
    });
}
angular.module('brbteam').config(config).run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});
'use strict';

(function () {

  angular.module('brbteam').service('AuthService', AuthService);

  AuthService.$inject = ['$http', '$log', 'jwtHelper', '$state', '$localStorage'];

  function AuthService($http, $log, jwtHelper, $state, $localStorage) {

    function login(data, callback) {
      $http.post('/api/user/login', data).success(function (response) {
        if (response.token) {
          var currentUser = { username: data.username, token: response.token };
          var tokenPayload = jwtHelper.decodeToken(response.token);
          if (tokenPayload.role) {
            currentUser.role = tokenPayload.role;
          }
          $localStorage.currentUser = currentUser;

          $http.defaults.headers.common.Authorization = response.token;
          // callback za uspesan login
          callback(true);
          $state.go('index.main');
        } else {
          // callback za neuspesan login
          callback(false);
        }
      });
    }

    function logout() {
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
      $state.go('login');
    }

    function signup(data, callback) {
      $http.post('/api/user/signup', data).success(function (msg) {
        callback(true);
        $state.go('index.main');
      }).error(function (msg) {
        callback(false);
      });
    }

    function currentUser() {
      return $localStorage.currentUser;
    }

    return {
      login: login,
      logout: logout,
      signup: signup,
      currentUser: currentUser
    };
  }
})();
'use strict';

(function () {

  angular.module('brbteam').service('ResourceService', ResourceService);

  ResourceService.$inject = ['$http'];

  function ResourceService($http) {

    var questionApiUrl = "http://localhost:4000/api";

    // Questions
    var addQuestion = function addQuestion(data) {
      return $http.post(questionApiUrl + '/question/new', data);
    };

    var searchQuestion = function searchQuestion(data) {
      return $http.post(questionApiUrl + '/questions', data);
    };

    var addRoom = function addRoom(data) {
      return $http.post('/api/room/new', data);
    };

    var listRooms = function listRooms() {
      return $http.get('/api/room/list');
    };

    var closeRoom = function closeRoom(name) {
      return $http.post('/api/room/' + name + "/close");
    };

    var joinRoom = function joinRoom(user, room) {
      return $http.put('/api/room/' + room + "/join/" + user);
    };

    var roomAdmin = function roomAdmin(room) {
      return $http.get('/api/room/' + room + "/admin");
    };

    var getUser = function getUser(name) {
      return $http.get('/api/user/' + name);
    };

    var updateUser = function updateUser(name, data) {
      return $http.put('/api/user/' + name, data);
    };

    var activeRoom = function activeRoom(name) {
      return $http.get('/api/user/' + name + "/room");
    };

    return {
      // Questions
      addQuestion: addQuestion,
      searchQuestion: searchQuestion,

      // Rooms
      addRoom: addRoom,
      listRooms: listRooms,
      closeRoom: closeRoom,
      joinRoom: joinRoom,
      roomAdmin: roomAdmin,

      // Users
      getUser: getUser,
      updateUser: updateUser,
      activeRoom: activeRoom
    };
  }
})();
'use strict';

(function () {

  angular.module('brbteam').service('RoomService', RoomService);

  RoomService.$inject = ['$http', 'AuthService'];

  //TODO: we need to write it in and check from the server so the room stays even if you log out or close

  function RoomService($http, AuthService) {

    var currRoom = {};

    function getRoomName() {

      if (currRoom.name) {
        return currRoom.name;
      }
    }

    function setRoomName(name) {
      currRoom.name = name;
    }

    function hasActiveRoom() {
      if (currRoom.name) {
        return true;
      }

      return false;
    }

    return {
      getRoomName: getRoomName,
      setRoomName: setRoomName,
      hasActiveRoom: hasActiveRoom
    };
  }
})();
'use strict';

(function () {

  angular.module('brbteam').service('SocketService', SocketService);

  SocketService.$inject = ['socketFactory'];

  function SocketService(socketFactory) {
    return socketFactory();
  }
})();
'use strict';

/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function link(scope, element) {
            var listener = function listener(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Brb Team';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Brb team | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    };
}

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });
        }
    };
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'app/theme/views/common/ibox_tools.html',
        controller: function controller($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function controller($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 100);
            };
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function controller($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(function () {
                        $('#side-menu').fadeIn(400);
                    }, 200);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(function () {
                        $('#side-menu').fadeIn(400);
                    }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            };
        }
    };
}

function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });
            });
        }
    };
}

/**
 *
 * Pass all functions into module
 */
angular.module('brbteam').directive('pageTitle', pageTitle).directive('sideNavigation', sideNavigation).directive('iboxTools', iboxTools).directive('minimalizaSidebar', minimalizaSidebar).directive('chatSlimScroll', chatSlimScroll).directive('iboxToolsFullScreen', iboxToolsFullScreen);
"use strict";

/**
 * INSPINIA - Responsive Admin Theme
 * 2.5
 *
 * Custom scripts
 */

$(document).ready(function () {

    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if (navbarHeigh > wrapperHeigh) {
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if (navbarHeigh < wrapperHeigh) {
            $('#page-wrapper').css("min-height", $(window).height() + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }
    }

    $(window).bind("load resize scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    setTimeout(function () {
        fix_height();
    });
});

// Minimalize menu when screen is less than 768px
$(function () {
    $(window).bind("load resize", function () {
        if ($(document).width() < 769) {
            $('body').addClass('body-small');
        } else {
            $('body').removeClass('body-small');
        }
    });
});
'use strict';

(function () {

  angular.module('brbteam').controller('MainController', MainController);

  MainController.$inject = ['AuthService'];

  function MainController(AuthService) {
    var vm = this;

    // Data
    if (AuthService.currentUser() !== undefined) {
      vm.userName = AuthService.currentUser().username;
    }

    // Functions
    vm.logout = logout;

    function logout() {
      AuthService.logout();
    }
  }
})();
'use strict';

(function () {

  angular.module('brbteam').controller('AuthController', AuthController);

  AuthController.$inject = ['AuthService', '$log'];

  function AuthController(AuthService, $log) {
    var vm = this;

    // Data
    vm.signupData = {};
    vm.loginData = {};

    // Functions
    vm.login = login;
    vm.signup = signup;

    function login() {
      AuthService.login(vm.loginData, function (success) {
        if (success) {
          $log.info('Succesfull login');
        } else {
          $log.info('Login failed');
        }
      });
    }

    function signup() {

      AuthService.signup(vm.signupData, function (success) {
        if (success) {
          $log.info('Succesfull signup');
        } else {
          $log.info('Signup failed');
        }
      });
    }
  }
})();
'use strict';

(function () {
  angular.module('brbteam').controller('HomeController', HomeController);

  HomeController.$inject = ['ResourceService', '$log', '$state', 'RoomService', 'AuthService'];

  function HomeController(ResourceService, $log, $state, RoomService, AuthService) {
    var vm = this;

    // Data
    vm.room = {};
    vm.roomsList = [];
    vm.currUser = AuthService.currentUser().username;

    // Functions
    vm.addRoom = addRoom;
    vm.joinRoom = joinRoom;

    ResourceService.listRooms().success(function (data) {
      vm.roomsList = data;
    });

    function addRoom() {

      if (vm.room.privateRoom == undefined) {
        vm.room.privateRoom = false;
      }

      vm.room.admin = vm.currUser;

      ResourceService.addRoom(vm.room).success(function (response) {
        $log.info(response);
        RoomService.setRoomName(vm.room.name);
        vm.room = {};
        $state.go('index.myroom');
      }).error(function (response) {
        $log.info(response);
      });
    }

    function joinRoom(roomName) {
      ResourceService.joinRoom(vm.currUser, roomName).success(function (response) {
        $log.info("joined the room");
        $state.go('index.myroom');
      }).error(function (response) {
        $log.info("Error joining room");
      });
    }
  }
})();
'use strict';

(function () {

  angular.module('brbteam').controller('InterviewController', InterviewController);

  InterviewController.$inject = ['SocketService', '$state', 'RoomService', '$log', 'AuthService', 'ResourceService'];

  function InterviewController(SocketService, $state, RoomService, $log, AuthService, ResourceService) {
    var vm = this;

    vm.currentUser = AuthService.currentUser().username;

    vm.hasRoom = false;
    vm.isAdmin = false;

    ResourceService.activeRoom(vm.currentUser).success(function (response) {
      $log.info(response);
      vm.currRoomName = response.room;
      vm.hasRoom = true;

      if (response.room == undefined || response.room == "") {
        vm.hasRoom = false;
      }

      connectToRoom();

      ResourceService.roomAdmin(vm.currRoomName).success(function (data) {
        if (data.admin === vm.currentUser) {
          vm.isAdmin = true;
        }
      });
    }).error(function (response) {});

    // Data
    vm.editorOptions = {
      lineNumbers: true,
      theme: 'twilight',
      lineWrapping: true,
      height: 500,
      mode: 'javascript'
    };

    vm.currentCode = "";
    vm.currentMsg = "";
    vm.messages = [];

    vm.users = [];
    vm.users.push(vm.currentUser);

    console.log(vm.currRoomName);

    // Functions
    vm.change = change;
    vm.sendMsg = sendMsg;
    vm.closeRoom = closeRoom;

    function connectToRoom() {
      // connect to the current room
      if (vm.currRoomName) {
        var roomData = {};
        roomData.room = vm.currRoomName;
        roomData.user = vm.currentUser;

        SocketService.emit('room', roomData);
      }
    }

    // parse received messages
    SocketService.on("msg", function (msg) {
      $log.info(msg);
      msg.state = "left";
      vm.messages.push(msg);
    });

    // When a user has joined the room
    SocketService.on("adduser", function (user) {
      vm.users.push(user);
    });

    // We are getting what the user typed into the code editor
    SocketService.on("type", function (msg) {
      $log.info(msg.data);
      vm.currentCode += msg.data;
    });

    function change() {
      var msg = {};
      msg.data = vm.currentCode.slice(-1);
      msg.room = vm.currRoomName;

      SocketService.emit("type", msg);
    }

    function sendMsg() {
      var msg = {};
      msg.room = vm.currRoomName;
      msg.data = vm.currentMsg;
      msg.name = vm.currentUser;
      msg.date = new Date();
      msg.state = "right";

      $log.info(msg);

      vm.messages.push(msg);

      SocketService.emit('msg', msg);
      $log.info("msg sent to server to send to other clients");
      vm.currentMsg = "";
    }

    function closeRoom() {

      ResourceService.closeRoom(vm.currRoomName).success(function (response) {
        $log.info("Room closed");
        $state.go('index.main');
      });
    }
  }
})();
'use strict';

(function () {

  angular.module('brbteam').controller('QuestionsController', QuestionsController);

  QuestionsController.$inject = ['$http', 'ResourceService'];

  function QuestionsController($http, ResourceService) {

    var vm = this;

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

      ResourceService.addQuestion(vm.form).success(function (response) {
        console.log(response);
        vm.form.tag = "";
        vm.form.question = "";
      }).error(function (response) {
        console.log("Error while adding a new question");
      });
    }

    function searchQuestion() {
      console.log(vm.search.tags);

      ResourceService.searchQuestion(vm.search).success(function (response) {
        vm.foundQuestions = response;
      }).error(function (response) {
        console.log("Error while searching questions");
      });
    }
  }
})();
'use strict';

(function () {

  angular.module('brbteam').controller('SettingsController', SettingsController);

  SettingsController.$inject = ['ResourceService', '$log', 'AuthService'];

  function SettingsController(ResourceService, $log, AuthService) {
    var vm = this;

    // Data
    vm.userSettings = {};
    vm.username = AuthService.currentUser().username;

    ResourceService.getUser(vm.username).success(function (data) {
      $log.info(data);
      vm.userSettings = data.msg[0];
    });

    // Functions
    vm.saveUser = saveUser;

    function saveUser() {
      $log.info(vm.userSettings);

      ResourceService.updateUser(vm.username, vm.userSettings).success(function (response) {
        $log.info("User updated");
        alert("Updated");
      }).error(function (response) {
        $log.info("Error while updating user");
      });
    }
  }
})();
//# sourceMappingURL=client.js.map
