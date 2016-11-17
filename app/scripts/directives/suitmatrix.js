'use strict';

/*
 * Directive for a suit toggling for single hand on main preflophand object
 */
rangeStatApp.directive('suitMatrix', [function() {
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
