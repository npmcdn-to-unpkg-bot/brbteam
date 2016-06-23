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
           callback(true, response.msg);
           $state.go('index.main');
       } else {
           // callback za neuspesan login
           callback(false, response.msg);
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
        .success((response) => {
          if(response.success) {
            callback(true, response.msg);
            $state.go('login');
          } else {
            callback(false, response.msg);
          }

        })
        .error((response) => {
          callback(false, response.msg);
        });
    }

    function currentUser() {
      return $localStorage.currentUser;
    }

    function isLogedIn() {
      if($localStorage.currentUser) {
        return true;
      } else {
        return false;
      }
    }

    return {
      login : login,
      logout : logout,
      signup : signup,
      currentUser : currentUser,
      isLogedIn : isLogedIn
    }

  }


})()
