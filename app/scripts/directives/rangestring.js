'use strict';
var _ = window._;//to shut up jshint

/**
 * Creates the range string directive to put on the
 * range string model's input
 */

rangeStatApp.directive('rangeString', ['RangeParser', 'RangeFormatter', function(RangeParser, RangeFormatter) {
  return {
    scope: {
      preflopHands: '=',
      activeInputMode: '='
    },
    require: 'ngModel',
    link: function(scope, element, attrs, rangeStringCtrl) {


      var rangeFormatter = new RangeFormatter(scope.preflopHands);
      var rangeParser = new RangeParser(scope.preflopHands);


      scope.$watch('preflopHands', function(){
        if (scope.activeInputMode.inputMode === 'userstring') return;
        var oldval = element[0].value.split(',');
        var newval = rangeFormatter.rangeToString().split(',');
        oldval = _.map(oldval, function(el) { return el.trim(); });
        newval = _.map(newval, function(el) { return el.trim(); });

        //try to preserve users input order
        var oldOnes = _.intersection(oldval, newval);
        var newOnes = _.difference(newval, oldOnes);
        var newRangeString = _.union(oldOnes, newOnes).join(', ');
        element[0].value = newRangeString;
        rangeStringCtrl.$setValidity('rangeString', true);
      }, true);

      var stringWatcher = function() {
        scope.activeInputMode.inputMode = 'userstring';
        try {
          var success = true;
          rangeParser.parseRange(rangeStringCtrl.$viewValue);
        } catch(err) {
          if (err === 'invalid tag') {
            success = false;
            rangeStringCtrl.$setValidity('rangeString', false);
          } else {
            throw err;
          }
        }
        if (success) rangeStringCtrl.$setValidity('rangeString', true);
      };

      scope.$watch(function() {return rangeStringCtrl.$viewValue;}, stringWatcher);
    }
  }
}]);
