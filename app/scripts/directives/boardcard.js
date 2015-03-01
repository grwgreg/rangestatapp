'use strict';
 /*
  * Directive for a single board card in board matrix
  */
rangeStatApp.directive('boardCard', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                suit: '@',
                rank: '@',
                board: '='
            },
            templateUrl: '/views/boardcard.html', 
            controller: ['$scope', function($scope) {

              $scope.suits = {
                c: 'club',
                d: 'diam',
                h: 'heart',
                s: 'spade'
              };

              $scope.toggleOn = function() {
                var on = $scope.isOn();
                if (!on) {
                  $scope.board.push($scope.rank + $scope.suit);
                } else {
                  var index = $scope.board.indexOf($scope.rank + $scope.suit);
                  (index > -1) && $scope.board.splice(index, 1);
                }
              }

              $scope.isOn = function() {
                return $scope.board.indexOf($scope.rank + $scope.suit) > -1;
              }

              $scope.validBoard = function() {
                return ($scope.board.length >= 5) && !$scope.isOn();
              }
            
  
            }] 
        };
    }]);
