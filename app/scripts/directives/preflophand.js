'use strict';

 /*
  * Directive for a single preflop hand ie AK, JJ on the main preflophand object
  */
rangeStatApp.directive('preflopHand', ['preflopHands', function(preflopHands) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ranks: '@',
                active: '=',
                suitType: '@',
            },
            templateUrl: '/flopzilla/app/views/preflopHand.html', 
            controller: 'preflopHandCtrl'
        };
    }]);
