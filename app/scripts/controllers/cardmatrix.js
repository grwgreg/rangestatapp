'use strict';
var _ = window._;//to shut up jshint

rangeStatApp.controller('cardMatrixCtrl', ['$scope', 'preflopHands', 'tagMatrix', function ($scope, preflopHands, tagMatrix) {

   $scope.tagMatrix = tagMatrix;

}]);
