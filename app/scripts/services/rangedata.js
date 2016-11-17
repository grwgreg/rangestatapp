'use strict';

rangeStatApp.factory('rangeData', ['$http', 'RANGE_SERVER', function($http, RANGE_SERVER) {

  var get = function(rangeInput) {
    var board = rangeInput.board;
    var range = rangeInput.range;
    return $http({
      method: 'GET',
      url: RANGE_SERVER + board + '/' + range
    });
  };

  return {
    get: get
  };

}]);
