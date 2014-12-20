'use strict';
var _ = window._;//to shut up jshint


rangeStatApp.directive('handSuits', [function() {
  
  return {
    restrict: 'E',
    replace: true,
    scope: {
      active: '=',
      suits: '@'
    },
    templateUrl: '/flopzilla/app/views/handsuits.html',
    controller: ['$scope', function($scope) {

      var comboByType = {
        's' : ['cc', 'dd', 'hh', 'ss'],
        'p' : ['cd', 'ch', 'cs', 'dh', 'ds', 'hs'],
        'o' : ['cd', 'ch', 'cs', 'dc', 'dh', 'ds', 'hc', 'hd', 'hs', 'sc', 'sd', 'sh']
      };

      $scope.isOn = function() {
        return $scope.active.cards.combos[$scope.suits];
      };

      $scope.isDisabled = function() {
        return -1 === _.indexOf(comboByType[$scope.active.type], $scope.suits);
      };

      $scope.toggleOn = function() {
        $scope.active.cards.combos[$scope.suits] = !$scope.active.cards.combos[$scope.suits];
      };


      var suitsClasses = $scope.suits.split('').map(function(suit) {
        if (suit === 'c') return 'club';
        else if (suit === 'd') return "diam";
        else if (suit === 'h') return "heart";
        else return 'spade';
      });
      $scope.suitClass1 = suitsClasses[0];
      $scope.suitClass2 = suitsClasses[1];
    }]
  };
}]);
