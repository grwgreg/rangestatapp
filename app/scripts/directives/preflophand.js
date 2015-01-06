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
            templateUrl: '/views/preflopHand.html', 
            controller: 'preflopHandCtrl'
//            controllerAs: 'hand'
// blah can't use controller as in directives yet ;_; 
// https://github.com/angular/angular.js/issues/7635
        };
    }]);
