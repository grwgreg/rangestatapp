'use strict';

/*
 * Directive for tooltip over range chart
 */
rangeStatApp.directive('toolTip', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      tip: '='
    },
    templateUrl: '/views/tooltip.html',
    controllerAs: 'toolTip',
    controller: ['$scope', function($scope) {
      var vm = this;
      this.rangeVisible = true;
      this.toggleView = function(view) {
        this.rangeVisible = view === 'range';
        return false;
      };
    }]
  };
}]);
