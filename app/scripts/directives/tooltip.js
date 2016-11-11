'use strict';

 /*
  * Directive for a single preflop hand ie AK, JJ on the main preflophand object
  */
rangeStatApp.directive('toolTip', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                tip: '='
            },
            templateUrl: '/views/tooltip.html', 
/*
            controllerAs: 'toolTip',
            controller: ['$scope', function($scope) {
console.log('runned');
}]
*/
        };
    }]);
