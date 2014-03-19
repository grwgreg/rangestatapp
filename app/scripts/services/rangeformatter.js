'use strict';
var _ = window._;

rangeStatApp.factory('RangeFormatter', function() {
  var cards = '23456789TJQKA'.split('').reverse(),
    nonPaired = [],
    paired = [];

  _.each(cards, function(lCard) {
    var rCards = cards.slice(cards.indexOf(lCard) + 1),
      col = [];
    _.each(rCards, function(rCard) {
        col.push(lCard + rCard);
      });
    if (col.length > 0) nonPaired.push(col);
  });

  _.each(cards, function(card) {
    paired.push(card + card);
  });

  var RangeFormatter = function(preflopHands) {
    this.rangeToString = function() {
      var rangeStrings = [],
        pairs = this.groupHands(paired, 'p');

      _.each(pairs, function(list) {
        rangeStrings.push(this.listToString(list, 'p'));
      }, this);

      _.each(nonPaired, function(col) {
        var offs = this.groupHands(col, 'o'),
          suits = this.groupHands(col, 's'),
          inBoth = this.inBothGroups(offs,suits);

        offs = this.removeInBoth(offs, inBoth);
        suits = this.removeInBoth(suits, inBoth);

        _.each([[inBoth, ''], [offs, 'o'], [suits, 's']], function(el) {
          _.each(el[0], function(list) {
            rangeStrings.push(this.listToString(list, el[1]));
          }, this);
        }, this);
      }, this);

      return rangeStrings.join(', ');
    };

    this.removeInBoth = function(group1, group2) {
      return _.filter(group1, function(list) {
        var found = true;
        _.each(group2, function(listInBoth) {
          if (_.isEqual(listInBoth, list)) found = false;
        });
        return found;
      });
    };

    //consider renaming to groupToString, it makes more sense!
    //also break this up so its readable ie this.pairlistToString or something
    //or maybe make a method to parse out what type of list it is and then use that
    this.listToString = function(list, typeString) {
      if (_.isUndefined(typeString)) typeString = '';
      if (typeString === 'p') {
        if (list.length === 1) {
          return list[0];
        }
        if (list[0].length === 4) {//88cs,88ch
          return list.join(', ');
        }
        return list[0] + '-' + _.last(list);
      }
      if (list.length === 1) {
        if (list[0].length === 4) {
          return list[0];//AKcs already has typeString
        }
        return list[0] + typeString;
      } else if (list[0].length === 2) {
        return list[0] + '-' + _.last(list)[1] + typeString;
      } else if (list[0].length === 4) {
        return list.join(', ');
      }
    };

    this.inBothGroups = function(osGroups, sGroups) {
      var cards = '23456789TJQKA'.split(''),
        osLen = osGroups.length, sLen = sGroups.length,
        both = [], i=0, j=0;
      for (; i < osLen ; i++) {
        for (; j < sLen; j++) {
          //break if second card is lower ie TJ wont match anything past TT
          //make hash instead of card array? todo performance
          if (_.indexOf(cards, osGroups[i][0][1]) > _.indexOf(cards, sGroups[j][0][1])) {
            break;
          }
          if (_.isEqual(osGroups[i], sGroups[j])) {
            both.push(osGroups[i]);
            break;
          }
        }
      }
      return both;
    };

    this.groupHands = function(hands, type) {
      var prevStaged = false,
          groupPointer = 0,
          groups = [[]];
      _.each(hands, function(hand) {
        var on = this.checkOn(hand, type),//this is redundant if only called from rangetostringmethod
          all = this.checkAll(hand, type);
        if (on && all) {
          if (prevStaged) groups[groupPointer].push(hand);
          else {
            groups.push([hand]);
            groupPointer++;
            prevStaged = true;
          }
        }

        else if (on && !all) {
          groups.push(this.comboFind(hand, type));
          groupPointer++;
          prevStaged = false;//if not all then always gets own group (JT-8,J7cc,J7dd)
        }

        else prevStaged = false;

      }, this);
      return _.reject(groups, function(el) {
        return _.isEmpty(el);
      });
    };

    this.comboFind = function(hand, type) {
      var finderFn = '';
      if (type === 's') finderFn = 'suitedOnCombos';
      else if (type === 'o') finderFn = 'offSuitedOnCombos';
      else finderFn = 'allOnCombos';
      var combos = preflopHands[hand][finderFn]();
      return _.map(combos, function(combo) {
        return hand + combo;
      });
    };

    this.checkOn = function(hand, type) {
      var on = '';
      if (type === 's') on = 'suitedOn';
      else if (type === 'o') on = 'offSuitedOn';
      else on = 'pairOn';
      return preflopHands[hand][on];
    };

    this.checkAll = function(hand, type) {
      var checker = '';
      if (type === 's') checker = 'allSuits';
      else if (type === 'o') checker = 'allOffSuits';
      else checker = 'all';
      return preflopHands[hand][checker]();
    };

  };
  return RangeFormatter;
});
