'use strict';
var _ = window._;//to shut up jshint

/**
 * Creates the range string directive to put on the
 * range string model's input
 */

/**
 *
 * greg why didn't you just inject the formatter and parser into this directive???
 * can I set up parser and formatter 1x in compile? ie is link run every digest?
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
        if (scope.activeInputMode === 'userstring') return;
        var oldval = element[0].value.split(',');
      //  var newval = scope.rangeFormatter.rangeToString().split(',');
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

      //greg todo might be able to use rangeStringCtr.$viewValue in a function
      //ie pass teh $watch a function to return $rangeStringCtrl, then pass in
      //the callback
      var stringWatcher = function() {
        scope.activeInputMode = 'userstring';
        // make a test for this directive this point of failure is arbitrary
        try {
          var success = true;
          //scope.rangeParser.parseRange(this.$viewValue);
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

//      rangeStringCtrl.$viewChangeListeners.push(stringWatcher);
      scope.$watch(function() {return rangeStringCtrl.$viewValue;}, stringWatcher);
    }
  }
}]);
