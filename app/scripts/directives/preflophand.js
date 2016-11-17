'use strict';

/*
 * Directive for a single preflop hand ie AK, JJ on the main preflophand object
 */
rangeStatApp.directive('preflopHand', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ranks: '@',
      active: '=',
      suitType: '@',
    },
    templateUrl: '/views/preflopHand.html',
    controller: 'PreflopHandCtrl',
    controllerAs: 'preflopHand'
  };
}]);
