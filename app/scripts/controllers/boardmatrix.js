'use strict';

rangeStatApp.controller('boardMatrixCtrl', ['$scope', function ($scope) {

  var vm;
  $scope.vm = vm = {};
  vm.ranks = "AKQJT98765432".split('');
  vm.suits = "cdhs".split('');
  vm.board = [];

  $scope.boardDisplay = function() {
    return vm.board.join();
  };

  
  

}]);
