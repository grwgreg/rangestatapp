'use strict';
var _ = window._;//to shut up jshint

rangeStatApp.controller('MainCtrl', ['$scope', 'preflopHands', 'rangeFormatter', function ($scope, preflopHands, rangeFormatter) {

    var rangeFormatter = new rangeFormatter(preflopHands);
    $scope.rangeFormatter = rangeFormatter;
    console.log('formatter: ', rangeFormatter);
    $scope.ranges = preflopHands;

    //$scope.ranges['AK'].offSuitedOn = true;

    $scope.active = {
      cards: $scope.ranges['AK'],
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
    controller: function($scope) { //link works here too
      $scope.deb = function() {
        console.log($scope.ranges);
        console.log($scope.active.tag);
        $scope.ranges['97'].combos.cc = false;
        $scope.ranges['98'].combos.dc = false;
        $scope.ranges['99'].combos.cd = false;
      };
    }
  };
});
