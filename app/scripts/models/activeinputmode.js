'use strict';
/**
 * Object to keep track of whether user is editing range via text input or buttons
 * and the current hand being edited
 */
rangeStatApp.factory('activeInputMode', ['preflopHands', function(preflopHands) {

  return {
    cards: preflopHands['AK'],
    tag: 'AKo',
    type: 'o',
    inputMode: 'userstring'
  };

}]);
