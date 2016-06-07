(() => {

  angular.module('app.core')
         .service('ResourceService', ResourceService);


  function ResourceService($http) {

    const questionApiUrl = "http://localhost:4000/api";

    // Questions
    let addQuestion = (data) => {
      return $http.post(questionApiUrl + '/question/new', data);
    }

    return {
      addQuestion : addQuestion
    }

  }

})();
