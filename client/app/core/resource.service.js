(() => {

  angular.module('inspinia')
         .service('ResourceService', ResourceService);


  function ResourceService($http) {

    const questionApiUrl = "http://localhost:4000/api";

    // Questions
    let addQuestion = (data) => {
      return $http.post(questionApiUrl + '/question/new', data);
    }

    let searchQuestion = (data) => {
      console.log(data);
      return $http.post(questionApiUrl + '/questions', data);
    }

    return {
      addQuestion : addQuestion,
      searchQuestion : searchQuestion
    }

  }

})();
