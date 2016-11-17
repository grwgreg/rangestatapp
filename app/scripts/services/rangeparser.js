'use strict';

rangeStatApp.factory('RangeParser', ['_', function(_) {

  var RangeParser = function(preflopHands) {

    var handTypes = {
      suited: ['suitSpanner', 'suited'],
      offsuited: ['offsuitSpanner', 'offsuit'],
      both: ['both']
    };

    this.parseRange = function(rangeString) {
      if (!rangeString || rangeString.trim() === '') return this.resetPreflopHands();
      var tags = this.expandRangeTags(rangeString);
      var tagBuckets = this.buildTagBuckets(tags);
      this.buildRange(tagBuckets);
    };

    this.buildRange = function(tagBuckets) {
      this.resetPreflopHands();

      this.turnOnCombos(tagBuckets);

      _.each(tagBuckets.single, function(singles) {
        this.turnOnSingles(tagBuckets);
      }, this);
    };

    this.turnOnCombos = function(tagBuckets) {

      var handsToSet = {
        suits: tagBuckets.suited,
        offsuits: tagBuckets.offSuited,
        both: tagBuckets.both
      }

      _.each(handsToSet, function(bucket, type) {

        _.each(bucket, function(tag) {
          preflopHands[tag].setAll(type, true);
        });

      });

    };

    this.turnOnSingles = function(tagBuckets) {
      var singles = tagBuckets.single;
      _.each(singles, function(combos, tag) {
        var onTypes = [];
        var alreadyOn = this.alreadyOn(tagBuckets, tag);
        if (alreadyOn == 'both') return;

        var task = [{
          alreadyOn: 'suited',
          opposite: 'offsuits'
        }, {
          alreadyOn: 'offSuited',
          opposite: 'suits'
        }, {
          alreadyOn: 'none',
          opposite: 'both'
        }];

        _.each(task, function(t) {
          if (alreadyOn === t.alreadyOn) {
            preflopHands[tag].setAll(t.opposite, false);
            _.each(combos, function(combo) {
              preflopHands[tag].combos[combo] = true;
              var onType = (combo[0] === combo[1]) ? 'suited' : 'offSuited';
              onTypes = _.union([onType], onTypes);
            }, this);
          }
        }, this);

        this.toggleOnButtons(onTypes, tag);

      }, this);

    };

    this.toggleOnButtons = function(onTypes, tag) {
      if (onTypes.indexOf('suited') !== -1) preflopHands[tag].suitedOn = true;
      if (onTypes.indexOf('offSuited') !== -1) preflopHands[tag].offSuitedOn = true;
      if (tag[0] === tag[1]) preflopHands[tag].pairOn = true;
    }


    this.alreadyOn = function(tagBuckets, tag) {
      var alreadyOn = 'none';
      var onTypes = [];
      if (tagBuckets.both.indexOf(tag) !== -1) {
        alreadyOn = 'both';
      } else if (tagBuckets.suited.indexOf(tag) !== -1) {
        alreadyOn = 'suited';
      } else if (tagBuckets.offSuited.indexOf(tag) !== -1) {
        alreadyOn = 'offSuited';
      }
      return alreadyOn;
    };

    this.resetPreflopHands = function() {
      _.each(preflopHands, function(hand) {
        hand.setAll('both', true);
        hand.on = false;
        hand.pairOn = false;
        hand.suitedOn = false;
        hand.offSuitedOn = false;
      });
    }

    this.buildTagBuckets = function(tags) {
      var tagBuckets = {
        'suited': [],
        'offSuited': [],
        'both': [],
        'single': {} //"KJ": ['cc,'ss'] only KJ of clubs and spades 
      };

      _.each(tags, function(tag) {
        if (tag.length === 2) tagBuckets.both.push(tag);
        else if (tag.length === 4) this.addSingle(tag, tagBuckets);
        else if (tag.length === 3 && tag[2] === 's') tagBuckets.suited.push(tag.slice(0, 2));
        else if (tag.length === 3 && tag[2] === 'o') tagBuckets.offSuited.push(tag.slice(0, 2));
      }, this);
      return tagBuckets;
    };

    this.addSingle = function(tag, tagBuckets) {
      var hand = tag.slice(0, 2);
      var suit = tag.slice(2, 4);
      if (tagBuckets.single.hasOwnProperty(hand)) {
        tagBuckets.single[hand].push(suit);
      } else {
        tagBuckets.single[hand] = tagBuckets.single[hand] || [];
        tagBuckets.single[hand].push(suit);
      }
    }

    this.expandRangeTags = function(rangeString) {
      var allTags = [];
      var rangeTags = rangeString.trim().replace(/\,(\s)+?$/, '').split(',');
      _.each(rangeTags, function(rangeTag) {
        /*todo just check return type of getTagType instead of try/catch*/
        try {
          rangeTag = rangeTag.trim();
          var tagType = this.getTagType(rangeTag),
            tags = [rangeTag];
          if (tagType.toLowerCase().indexOf('spanner') !== -1) {
            tags = this.expandRangeTag(rangeTag, tagType);
          }
          allTags = allTags.concat(tags);
        } catch (err) {
          throw 'invalid tag';
        }
      }, this);
      return allTags;
    };

    this.expandRangeTag = function(rangeTag, tagType) {
      var cards = 'AKQJT98765432'.split(''),
        expandedTags = [],
        handType = '',
        start = _.indexOf(cards, rangeTag[1]),
        end = _.indexOf(cards, rangeTag[3]),
        span = cards.splice(start, end - start + 1);

      if (tagType !== 'pairSpanner') {
        if (tagType === 'suitSpanner') handType = 's';
        else if (tagType === 'offsuitSpanner') handType = 'o';
        expandedTags = _.map(span, function(rCard) {
          return rangeTag[0] + rCard + handType;
        });
      } else {
        expandedTags = _.map(span, function(card) {
          return card + card;
        });
      }
      return expandedTags;

    };

    this.getTagType = function(rangeTag) {
      //todo careful refactoring this, order matters with 'pair' and 'both'
      var tagTypes = {
          spanner: /^[A-Z\d]+-[A-Z\d]+$/.test(rangeTag),
          suitSpanner: /^[A-Z\d]+-[A-Z\d]s+$/.test(rangeTag),
          offsuitSpanner: /^[A-Z\d]+-[A-Z\d]o+$/.test(rangeTag),
          pairSpanner: /^([A-Z\d])\1-([A-Z\d])\2$/.test(rangeTag),
          offsuit: /^[A-Z\d][A-Z\d]o$/.test(rangeTag),
          suit: /^[A-Z\d][A-Z\d]s$/.test(rangeTag),
          both: /^[A-Z\d][A-Z\d]$/.test(rangeTag),
          single: /^[A-Z\d][A-Z\d][cdhs][cdhs]$/.test(rangeTag),
          pair: /^([A-Z\d])\1$/.test(rangeTag)
        },
        result = false;
      _.each(tagTypes, function(found, tagType) {
        if (found) result = tagType;
      });
      return result;
    };

  };

  return RangeParser;
}]);
