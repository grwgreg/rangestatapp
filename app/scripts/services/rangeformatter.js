'use strict';

rangeStatApp.factory('RangeFormatter', ['_', function(_) {

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
        this.preflopHands = preflopHands;
    };

    RangeFormatter.prototype = {
        rangeToString: function() {
            var rangeStrings = [];
            rangeStrings = this.addPairStrings(rangeStrings);
            rangeStrings = this.addNonPairStrings(rangeStrings);

            return rangeStrings.join(', ');
        },

        addNonPairStrings: function(rangeStrings) {
            _.each(nonPaired, function(col) {
                var columnGroups = this.nonPairGroups(col);

                _.each(columnGroups, function(groups) {
                    _.each(groups.groups, function(group) {
                        rangeStrings.push(this.groupToString(group, groups.type));
                    }, this);
                }, this);
            }, this);

            return rangeStrings;
        },

        nonPairGroups: function(col) {
                var offs = this.groupHands(col, 'o'),
                    suits = this.groupHands(col, 's'),
                    inBoth = this.inBothGroups(offs,suits);

                offs = this.removeInBoth(offs, inBoth);
                suits = this.removeInBoth(suits, inBoth);

            return [
                { groups: offs,
                    type: 'o' },
                { groups: suits,
                    type: 's' },
                { groups: inBoth,
                    type: '' },
            ];

        },

        addPairStrings: function(rangeStrings) {
            var pairGroups = this.groupHands(paired, 'p');

            _.each(pairGroups, function(group) {
                rangeStrings.push(this.groupToString(group, 'p'));
            }, this);

            return rangeStrings;
        },

        removeInBoth: function(group1, group2) {
            return _.filter(group1, function(list) {
                var found = true;
                _.each(group2, function(listInBoth) {
                    if (_.isEqual(listInBoth, list)) found = false;
                });
                return found;
            });
        },

        groupToString: function(group, typeString) {
            var groupString = '';
            typeString = typeString || '';

            if (typeString === 'p') { groupString = this.pairGroupToString(group);
            } else if (group.length === 1) {
                groupString = this.oneGroupToString(group, typeString);
            } else if (group[0].length === 2) {
                groupString = this.spanningGroupToString(group, typeString);
            } else if (group[0].length === 4) {
                groupString = this.singlesGroupToString(group);
            }
            return groupString;
        },

        singlesGroupToString: function(group) {
            return group.join(', ');
        },

        spanningGroupToString: function(group, typeString) {
            return group[0] + '-' + _.last(group)[1] + typeString;
        },

        oneGroupToString: function(group, typeString) {
            if (group[0].length === 4) {
                return group[0];//AKcs already has typeString
            }
            return group[0] + typeString;
        },

        pairGroupToString: function(group) {
            if (group.length === 1) {
                return group[0];
            }
            if (group[0].length === 4) {//88cs,88ch
                return group.join(', ');
            }
            return group[0] + '-' + _.last(group);
        },

        inBothGroups: function(osGroups, sGroups) {
          var inBoth = [];
          _.each(osGroups, function(g1) {
            _.each(sGroups, function(g2) {
              if (_.isEqual(g1, g2)) { inBoth.push(g1); };
            });
          });
          return inBoth;
        },

        groupHands: function(hands, type) {
            var prevStaged = false,
                groupIndex = 0,
                groups = [[]];

            _.each(hands, function(hand) {
                var on = this.checkOn(hand, type),
                    all = this.checkAll(hand, type);
                if (on && all) {
                    if (prevStaged) groups[groupIndex].push(hand);
                    else {
                        groups.push([hand]);
                        groupIndex++;
                        prevStaged = true;
                    }
                }

                else if (on && !all) {
                    groups.push(this.comboFind(hand, type));
                    groupIndex++;
                    prevStaged = false;
                }

                else prevStaged = false;

            }, this);
            return _.reject(groups, function(el) {
                return _.isEmpty(el);
            });
        },

        comboFind: function(hand, type) {
            var combos = this.preflopHands[hand].comboFind(type);
            return _.map(combos, function(combo) {
                return hand + combo;
            });
        },

        checkOn: function(hand, type) {
            return this.preflopHands[hand].checkOn(type);
        },

        checkAll: function(hand, type) {
            return this.preflopHands[hand].checkAll(type);
        }

    };

    return RangeFormatter;
}]);
