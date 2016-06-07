'use strict';

(function () {
  'use strict';

  angular.module('app', [

  // Global modules
  'app.core']);
})();
'use strict';

(function () {
  angular.module('app').config(config);

  function config($stateProvider) {
    'use strict';

    (function () {
      'use strict';

      angular.module('app.questions', ['app.core']).config(config);

      function config($stateProvider) {

        $stateProvider.state('index.main', {
          url: "/",
          templateUrl: "app/main/questions/questions.html"
        });
      }
    })();
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('app.core', ['ui.router', 'oc.lazyLoad', 'ui.bootstrap']);
})();
'use strict';

(function () {

  angular.module('app.core').service('ResourceService', ResourceService);

  function ResourceService($http) {

    var questionApiUrl = "http://localhost:4000/api";

    // Questions
    var addQuestion = function addQuestion(data) {
      return $http.post(questionApiUrl + '/question/new', data);
    };

    return {
      addQuestion: addQuestion
    };
  }
})();
'use strict';

/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl() {

  this.userName = 'Example user';
  this.helloText = 'Welcome in SeedProject';
  this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
};

angular.module('app.core').controller('MainCtrl', MainCtrl);
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
        templateUrl: 'views/common/ibox_tools.html',
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

/**
 *
 * Pass all functions into module
 */
angular.module('app.core').directive('pageTitle', pageTitle).directive('sideNavigation', sideNavigation).directive('iboxTools', iboxTools).directive('minimalizaSidebar', minimalizaSidebar).directive('iboxToolsFullScreen', iboxToolsFullScreen);
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
"use strict";
'use strict';

(function () {

  angular.module('app.questions').controller('QuestionsController', QuestionsController);

  //todo user ngInject

  function QuestionsController($scope, $http, ResourceService) {

    var vm = this;

    vm.title = "Find the right questions to ask";

    $scope.form = {};

    $scope.addQuestion = function () {
      console.log($scope.form.question);
      console.log($scope.form.tag);

      $scope.form.tags = [];
      $scope.form.tags.push($scope.form.tag);

      ResourceService.addQuestion($scope.form).success(function (response) {
        console.log(response);
      }).error(function (response) {
        console.log("Error while adding a new question");
      });
    };
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('app.questions', ['app.core']).config(config);

  function config($stateProvider) {

    $stateProvider.state('index.questions', {
      url: "/questions",
      templateUrl: "app/main/questions/questions.html",
      controller: 'QuestionsController',
      controllerAs: 'vm'
    });
  }
})();
//# sourceMappingURL=client.js.map
