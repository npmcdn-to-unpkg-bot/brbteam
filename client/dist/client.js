'use strict';

(function () {
    angular.module('brbteam', ['ui.router', // Routing
    'oc.lazyLoad', // ocLazyLoad
    'ui.bootstrap', // Ui Bootstrap
    'ui.codemirror', 'angular-jwt', 'ngStorage', 'btford.socket-io', 'ngAudio']);
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
angular.module('brbteam').config(config).run(function ($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {

        // if we go to login/register and are already logged in
        if ((toState.name == "login" || toState.name == "register") && AuthService.isLogedIn()) {
            $state.go("index.main");
        }

        // if we go to restricted urls but are not logged in
        if ((toState.name == "index.main" || toState.name == "index.myroom" || toState.name == "index.settings" || toState.name == "index.questions") && !AuthService.isLogedIn()) {
            $state.go("login");
        }
    });

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
        $state.go('login');
      }).error(function (msg) {
        callback(false);
      });
    }

    function currentUser() {
      return $localStorage.currentUser;
    }

    function isLogedIn() {
      if ($localStorage.currentUser) {
        return true;
      } else {
        return false;
      }
    }

    return {
      login: login,
      logout: logout,
      signup: signup,
      currentUser: currentUser,
      isLogedIn: isLogedIn
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

    var leaveRoom = function leaveRoom(user, room) {
      return $http.put('/api/room/' + room + "/leave/" + user);
    };

    var usersInRoom = function usersInRoom(room) {
      return $http.get('/api/room/' + room + "/users");
    };

    var getRoom = function getRoom(room) {
      return $http.get('/api/room/' + room);
    };

    var updateRoom = function updateRoom(room, data) {
      return $http.put('/api/room/' + room + "/update", data);
    };

    var roomAdmin = function roomAdmin(room) {
      return $http.get('/api/room/' + room + "/admin");
    };

    var executeCode = function executeCode(data) {
      return $http.post('/api/room/execute', data);
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

    var messagesInRoom = function messagesInRoom(room) {
      return $http.get('/api/messages/' + room);
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
      leaveRoom: leaveRoom,
      getRoom: getRoom,
      updateRoom: updateRoom,
      usersInRoom: usersInRoom,
      roomAdmin: roomAdmin,
      executeCode: executeCode,

      // Users
      getUser: getUser,
      updateUser: updateUser,
      activeRoom: activeRoom,

      // Messages
      messagesInRoom: messagesInRoom
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

function touchSpin() {
    return {
        restrict: 'A',
        scope: {
            spinOptions: '='
        },
        link: function link(scope, element, attrs) {
            scope.$watch(scope.spinOptions, function () {
                render();
            });
            var render = function render() {
                $(element).TouchSpin(scope.spinOptions);
            };
        }
    };
};

/**
 *
 * Pass all functions into module
 */
angular.module('brbteam').directive('pageTitle', pageTitle).directive('sideNavigation', sideNavigation).directive('iboxTools', iboxTools).directive('touchSpin', touchSpin).directive('minimalizaSidebar', minimalizaSidebar).directive('chatSlimScroll', chatSlimScroll).directive('iboxToolsFullScreen', iboxToolsFullScreen);
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

  MainController.$inject = ['AuthService', 'ResourceService'];

  function MainController(AuthService, ResourceService) {
    var vm = this;

    // Data
    if (AuthService.currentUser() !== undefined) {
      vm.userName = AuthService.currentUser().username;
    }

    ResourceService.activeRoom(vm.userName).success(function (response) {
      vm.roomName = response.room;
    });

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

  InterviewController.$inject = ['SocketService', '$state', 'RoomService', '$log', 'AuthService', 'ResourceService', '$scope', 'ngAudio'];

  function InterviewController(SocketService, $state, RoomService, $log, AuthService, ResourceService, $scope, ngAudio) {
    var vm = this;

    vm.currentUser = AuthService.currentUser().username;

    vm.hasRoom = false;
    vm.isAdmin = false;
    vm.rtcSwitch = false;
    vm.users = [];
    vm.openChat = false;
    vm.unseenMsgs = 0;

    var editor = null;

    vm.languages = ["javascript", "ruby", "python", "php"];
    vm.selectedLang = "javascript";
    vm.selectedTheme = "ambiance";

    vm.msgSound = ngAudio.load("assets/msg2.mp3");

    ResourceService.activeRoom(vm.currentUser).success(function (response) {
      $log.info(response);
      vm.currRoomName = response.room;
      vm.hasRoom = true;

      if (response.room == undefined || response.room == "") {
        vm.hasRoom = false;
      }

      connectToRoom();
      messagesLoad(vm.currRoomName);

      ResourceService.getRoom(vm.currRoomName).success(function (response) {
        vm.selectedLang = response.currLanguage;
        vm.selectedTheme = response.currTheme;
      });

      ResourceService.usersInRoom(vm.currRoomName).success(function (response) {

        angular.forEach(response, function (v, k) {
          if (vm.users.indexOf(v) === -1) {
            vm.users.push(v);
          }
        });
      });

      ResourceService.roomAdmin(vm.currRoomName).success(function (data) {
        if (data.admin === vm.currentUser) {
          vm.isAdmin = true;
        }
      });
    }).error(function (response) {});

    // load all msg conversation in the room
    function messagesLoad(room) {
      ResourceService.messagesInRoom(room).success(function (response) {
        $log.info(response);
        vm.messages = response;
      }).error(function (response) {});
    }

    // Data
    vm.editorOptions = {
      lineNumbers: true,
      theme: vm.selectedTheme,
      lineWrapping: true,
      height: 500,
      mode: 'ruby'
    };

    vm.currentCode = "";
    vm.codeEditor = [];
    vm.currentMsg = "";
    vm.messages = [];
    vm.consoleMessages = [];

    // Functions
    vm.sendMsg = sendMsg;
    vm.closeRoom = closeRoom;
    vm.changeTheme = changeTheme;
    vm.changeMode = changeMode;
    vm.runCode = runCode;
    vm.leaveRoom = leaveRoom;
    vm.changeChatState = changeChatState;

    vm.enableCamera = function () {
      loadWebRtc();
    };

    function loadWebRtc() {
      var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotesVideos',
        // immediately ask for camera access
        autoRequestMedia: true
      });

      webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom(vm.currRoomName);
      });
    }

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
      if (vm.openChat == false) {
        vm.unseenMsgs++;
      }
      vm.msgSound.play();
      msg.state = "left";
      vm.messages.push(msg);
    });

    // When a user has joined the room
    SocketService.on("adduser", function (user) {
      if (vm.users.indexOf(user) === -1) {
        vm.users.push(user);
      }
    });

    SocketService.on('leftroom', function (msg) {
      var index = vm.users.indexOf(msg.user);

      if (index !== -1) {
        vm.users.splice(index, 1);
      }
    });

    // We are getting what the user typed into the code editor
    SocketService.on("type", function (msg) {

      if (vm.codeEditor[msg.line] == undefined) {
        vm.codeEditor[msg.line] = "";
      }

      if (msg.type == "input") {
        vm.codeEditor[msg.line] = vm.codeEditor[msg.line].insertAt(msg.pos, msg.data);
      } else if (msg.type == "delete") {
        vm.codeEditor[msg.line] = vm.codeEditor[msg.line].deleteAt(msg.pos - 1);
      }

      vm.currentCode = "";
      for (var i = 0; i < vm.codeEditor.length; ++i) {
        vm.currentCode += vm.codeEditor[i] + "\n";
      }
    });

    function changeTheme(theme) {
      editor.setOption('theme', theme);
      vm.selectedTheme = theme;
      updateRoom();
    }

    function changeMode() {
      var mode = vm.selectedLang;

      if (vm.selectedLang == 'c#' || vm.selectedLang == 'c++' || vm.selectedLang == 'java') {
        mode = "clike";
      }

      updateRoom();
      editor.setOption('mode', mode);
    }

    function leaveRoom() {
      ResourceService.leaveRoom(vm.currentUser, vm.currRoomName).success(function (response) {
        SocketService.emit('leftroom', { "user": vm.currentUser, "room": vm.currRoomName });
        $state.go("index.main");
      }).error(function (response) {
        $log.info("Failed to leave the room");
      });
    }

    function sendMsg() {
      var msg = {};
      msg.room = vm.currRoomName;
      msg.data = vm.currentMsg;
      msg.name = vm.currentUser;
      msg.date = new Date();
      msg.state = "right";

      vm.messages.push(msg);

      SocketService.emit('msg', msg);
      vm.currentMsg = "";
    }

    function closeRoom() {

      ResourceService.closeRoom(vm.currRoomName).success(function (response) {
        $log.info("Room closed");
        $state.go('index.main');
      });
    }

    function runCode(req, res) {

      var data = {};
      data.code = vm.currentCode;
      data.type = vm.selectedLang;
      $log.info(data);

      ResourceService.executeCode(data).success(function (response) {
        vm.consoleMessages.push(response.stdout);
      });
    }

    $scope.codemirrorLoaded = function (_editor) {

      var _doc = _editor.getDoc();
      _editor.focus();

      _editor.setSize(-1, 470);

      editor = _editor;

      _editor.on("change", function (e, ch) {
        console.log(ch);

        var msg = {};
        msg.data = ch.text[0];
        msg.room = vm.currRoomName;
        msg.pos = ch.to.ch;
        msg.line = ch.to.line;

        console.log(msg);
        if (ch.origin == "+input") {
          msg.type = "input";
          SocketService.emit("type", msg);
        } else if (ch.origin == "+delete") {
          msg.type = "delete";
          SocketService.emit("type", msg);
        }
      });
    };

    function changeChatState() {
      vm.openChat = !vm.openChat;
      vm.unseenMsgs = 0;
    }

    function updateRoom() {
      var room = {};
      room.language = vm.selectedLang;
      room.theme = vm.selectedTheme;
      room.video = false;

      ResourceService.updateRoom(vm.currRoomName, room).success(function (err) {
        $log.info("Room updated");
      });
    }

    String.prototype.insertAt = function (index, string) {
      return this.substr(0, index) + string + this.substr(index);
    };

    String.prototype.deleteAt = function (pos) {
      //return this.slice(s, e) + this.slice(e + 1);
      return this.slice(0, pos) + this.slice(pos + 1, this.length);
    };
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
