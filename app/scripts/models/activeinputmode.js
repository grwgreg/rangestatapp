'use strict';
/**
  * The main preflop hand object
  */
rangeStatApp.factory('activeInputMode', ['preflopHands', function(preflopHands) {

        return {
            cards: preflopHands['AK'],
            tag: 'AKo',
            type: 'o',
            inputMode: 'cardmatrix'
        };

}]);
