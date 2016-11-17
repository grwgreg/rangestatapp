'use strict';

/*
 * Directive for a single preflop hand ie AK, JJ on the main preflophand object
 */
rangeStatApp.directive('cardMatrix', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      active: '='
    },
    templateUrl: '/views/cardmatrix.html',
    controller: 'CardMatrixCtrl',
    controllerAs: 'cardMatrix',
  };
}]);
