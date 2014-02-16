'use strict';

/*
 * Directive for a single preflop hand ie AK, JJ on the main preflophand object
 * These are added to the dom via the card matrix directive's compile step
 */
rangeStatApp.directive('preflopHand', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        cards: '=',
        active: '=',
        color: '@',
        tag: '@',
        handType: '@'
      },
      template: '<button type="button" class="{{color}} btn btn-xs" \
                ng-class="{pressed : isOn(), notall : !all()}" ng-click="toggleOn()"> \
                {{tag}}</button>',
      controller: function($scope) { //link works here too
        $scope.toggleOn = function() {
          $scope.active.cards = $scope.cards;
          $scope.active.tag = $scope.tag;
          $scope.active.type = $scope.handType;
          if ($scope.handType === 'o') $scope.cards.offSuitedOn = !$scope.cards.offSuitedOn;

          else if ($scope.handType === 'p') $scope.cards.pairOn = !$scope.cards.pairOn;

          else $scope.cards.suitedOn = !$scope.cards.suitedOn;
        };

        $scope.isOn = function() {
          if ($scope.handType === 'o') return $scope.cards.offSuitedOn;

          else if ($scope.handType === 'p') return $scope.cards.pairOn;

          else return $scope.cards.suitedOn;
        };

        $scope.all = function() {

          if ($scope.handType === 'o') return $scope.cards.allOffSuits();

          else if ($scope.handType === 'p') return $scope.cards.all();

          else return $scope.cards.allSuits();
        };
      }
    };
  });
