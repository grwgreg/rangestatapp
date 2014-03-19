'use strict';
var _ = window._;//to shut up jshint

/**
 * Creates the range string directive to put on the
 * range string model's input 
 */
//put card matrix logic in a factory too
rangeStatApp.directive('rangeString', [function() {
  return {
    scope: {
      rangeStringModel: '=',
      preflopHands: '=',
      rangeFormatter: '=',
      rangeParser: '='
    },
    require: 'ngModel',
    link: function(scope, element, attrs, rangeStringCtrl) {
      console.log('wat', scope.rangeStringModel);
      console.log(rangeStringCtrl);

      scope.$watch('preflopHands', function(){ 

        //element[0].value = scope.it.x * 2;
        element[0].value = scope.rangeFormatter.rangeToString();

      }, true);

      scope.$watch('rangeStringModel', function(newval) {
        console.log('new', newval);
        console.log(scope.rangeStringModel);

        //scope.rangeStringModel = 'ahaahaha changed you';

        //scope.rangeParser.parseRange('AK-5, 55, K6o, 76s, T2sc');
        scope.rangeParser.parseRange(newval);
      }, true);

    }
  }
}]);
