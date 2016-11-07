'use strict';

 /*
  * Directive for a single preflop hand ie AK, JJ on the main preflophand object
  */
rangeStatApp.directive('boardMatrix', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                board: '='
            },
            templateUrl: '/views/boardmatrix.html', 
            controller: 'BoardMatrixCtrl',
            controllerAs: 'boardMatrix',
        };
    }]);
