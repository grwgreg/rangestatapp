'use strict';
var _ = window._;//to shut up jshint

rangeStatApp.controller('MainCtrl', ['$scope', 'preflopHands', 'RangeFormatter', 'RangeParser', function ($scope, preflopHands, RangeFormatter, RangeParser) {

    $scope.main = {};
    $scope.main.rangeFormatter = new RangeFormatter(preflopHands);
    $scope.main.rangeParser = new RangeParser(preflopHands);
    $scope.main.rangeStringModel = 'hijeje';
    $scope.main.preflopHands = preflopHands;

    $scope.main.active = {
      cards: $scope.main.preflopHands['AK'],
      tag: 'AKo',
      type: 'o'
    };

  }])
  
.directive('deb', function() {
  return {
    restrict: 'E',
    replace: true,
    //template: '<span ng-click="add()">{{it }}</span>',
    template: function() { return['<button type="button" class="btn btn-xs"',
              'ng-click="deb()">DEBUG</button>'].join('');},
    controller: ['$scope', function($scope) { //link works here too
      $scope.deb = function() {
        console.log($scope.main.preflopHands);
        console.log($scope.main.active.tag);
        $scope.main.preflopHands['97'].combos.cc = false;
        $scope.main.preflopHands['98'].combos.dc = false;
        $scope.main.preflopHands['99'].combos.cd = false;
      };
    }]
  };
});
