'use strict';
var _ = window._;//to shut up jshint

/**
 * The main preflop hand object
 */
rangeStatApp.factory('preflopHands', ['PreflopHand', function(PreflopHand) {

  var preflopHands = {},
    cards = '23456789TJQKA'.split('');

  _.each(cards, function(rcard) {
    var lCards = cards.slice(cards.indexOf(rcard));
    _.each(lCards, function(lcard) {
      var isPair = (lcard === rcard);
      preflopHands[lcard + rcard] = new PreflopHand(isPair);
    });
  });

  return preflopHands;

}]);
