'use strict';

 /*
  * Directive for a single preflop hand ie AK, JJ on the main preflophand object
  */
rangeStatApp.directive('rangeChart', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                range: '=',
                board: '='
            },
            templateUrl: '/views/rangechart.html', 
            controller: 'RangeChartCtrl',
            controllerAs: 'rangeChart'
        };
    }]);
