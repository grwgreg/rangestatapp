'use strict';

rangeStatApp.factory('rangeData', ['$http', function($http) {

  var get = function(rangeInput) {
    var board = rangeInput.board;
    var range = rangeInput.range;
    return $http({
      method: 'GET',
      url: 'http://localhost:3000/' + board + '/' + range
    });
  };

  return {
    get: get
  };

}]);
