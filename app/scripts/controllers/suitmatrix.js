'use strict';
var _ = window._;//to shut up jshint

rangeStatApp.controller('suitMatrixCtrl', ['$scope', 'suitMatrix', function ($scope, suitMatrix) {

  $scope.suitMatrix = suitMatrix;

}]);
