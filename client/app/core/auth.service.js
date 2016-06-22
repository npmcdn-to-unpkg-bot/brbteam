(() => {

  angular.module('brbteam')
         .service('AuthService', AuthService);

  AuthService.$inject = ['$http', '$log', 'jwtHelper', '$state', '$localStorage'];

  function AuthService($http, $log, jwtHelper, $state, $localStorage)
  {

    function login(data, callback) {
      $http.post('/api/user/login', data)
      .success((response) => {
        if (response.token) {
          var currentUser = { username: data.username, token: response.token }
          var tokenPayload = jwtHelper.decodeToken(response.token);
          if(tokenPayload.role){
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
      $http.post('/api/user/signup', data)
        .success((msg) => {
          callback(true);
          $state.go('login');
        })
        .error((msg) => {
          callback(false);
        });
    }

    function currentUser() {
      return $localStorage.currentUser;
    }

    return {
      login : login,
      logout : logout,
      signup : signup,
      currentUser : currentUser
    }

  }


})()
