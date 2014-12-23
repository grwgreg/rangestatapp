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
            templateUrl: '/flopzilla/app/views/boardcard.html', 
            controller: ['$scope', function($scope) {

              var on = false;
              $scope.toggleOn = function() {
                on = !on;
                if (on) {
                  $scope.board.push($scope.rank + $scope.suit);
                } else {
                  var index = $scope.board.indexOf($scope.rank + $scope.suit);
                  (index > -1) && $scope.board.splice(index, 1);
                }
              }

              $scope.isOn = function() {
                return on;
              }

              $scope.validBoard = function() {
                return ($scope.board.length >= 5) && !on;
              }
            
  
            }] 
        };
    }]);
