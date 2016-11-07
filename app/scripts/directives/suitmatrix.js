'use strict';

 /*
  * Directive for a single preflop hand ie AK, JJ on the main preflophand object
  */
rangeStatApp.directive('suitMatrix', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                active: '='
            },
            templateUrl: '/views/suitmatrix.html', 
            controller: 'SuitMatrixCtrl',
            controllerAs: 'suitMatrix',
        };
    }]);
