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
      rangeFormatter: '='
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
      console.log(newval);
      console.log('hello?');
        //scope.it.x = newval/2;
      }, true);
    }
  }
}]);
