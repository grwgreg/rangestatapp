'use strict';
/**
  * Creates the range string directive to put on the
  * range string model's input
  */

rangeStatApp.directive('rangeString', ['RangeParser', 'RangeFormatter', '_', function(RangeParser, RangeFormatter, _) {
    return {
        scope: {
            preflopHands: '=',
            activeInputMode: '=',
            rangeStringModel: '='
        },
        require: 'ngModel',
        link: function(scope, element, attrs, rangeStringDummyCtrl) {

            var rangeFormatter = new RangeFormatter(scope.preflopHands);
            var rangeParser = new RangeParser(scope.preflopHands);

//            scope.activeInputMode.inputMode = scope.activeInputMode.inputMode || 'userstring';
            element[0].value = scope.rangeStringModel;

            scope.$watch('preflopHands', function(){
                if (scope.activeInputMode.inputMode === 'userstring') {
                  scope.rangeStringModel = rangeStringDummyCtrl.$viewValue;
                  return;
                }
                var oldval = element[0].value.split(',');
                var newval = rangeFormatter.rangeToString().split(',');
                oldval = _.map(oldval, function(el) { return el.trim(); });
                newval = _.map(newval, function(el) { return el.trim(); });

                //try to preserve users input order
                var oldOnes = _.intersection(oldval, newval);
                var newOnes = _.difference(newval, oldOnes);
                var newRangeString = _.union(oldOnes, newOnes).join(', ');
                element[0].value = newRangeString;
                scope.rangeStringModel = newRangeString;
                rangeStringDummyCtrl.$setValidity('rangeString', true);
            }, true);

            function stringWatcher() {
                scope.activeInputMode.inputMode = 'userstring';
                try {
                    var success = true;
                    rangeParser.parseRange(rangeStringDummyCtrl.$viewValue);
                } catch(err) {
                    if (err === 'invalid tag') {
                        success = false;
                        rangeStringDummyCtrl.$setValidity('rangeString', false);
                    } else {
                        throw err;
                    }
                }
                if (success) rangeStringDummyCtrl.$setValidity('rangeString', true);
            };

            scope.$watch(function() {return rangeStringDummyCtrl.$viewValue;}, stringWatcher);
        }
    }
}]);
