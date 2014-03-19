'use strict';
var _ = window._;

rangeStatApp.factory('RangeParser', function() {

  //just realized I forgot I was using different 'on' attributes like 'suitedOn', 'pairOn'
  //in the preflopHands object, yet the methods I wrote yesterday were just toggling their
  //individual combo values. I think I just fixed the setAll, setAllSuited type methods
  //on the preflopHands object but everything falls apart for singles!!!
  //this is because every combo is true by default but the top level button has an off on switch
  //this means you can't iterate them independently and switch them on one at a time
  //
  //you need to add another level to the tagbuckets for singles, keyed by top level
  //preflopHand index
  //
  //ie
  //
  //tagBuckets.singles = {
  //  'QT' : ['cs', 'ds', 'dd']
  //}
  //
  //then you Also need to check the 'QT' index is in the other buckets
  //so if 'QT' is in the suited bucket you have to setAllOffsuits(false)
  //and then iterate the rest of the singles and set to true
  var RangeParser = function(preflopHands) {


    var handTypes = {
      suited: ['suitSpanner', 'suited'],
      offsuited: ['offsuitSpanner', 'offsuit'],
      both: ['both']
    };


    //rangeString is the input field value
    this.parseRange = function(rangeString) {
      var tags = this.expandRangeTags(rangeString);
      var tagBuckets = this.buildTagBuckets(tags);
      this.buildRange(tagBuckets);
      
    };

    this.buildRange = function(tagBuckets) {
      this.resetPreflopHands();
      //dnry?
      _.each(tagBuckets.suited, function(tag) {
        preflopHands[tag].setAllSuited(true);
      });
      _.each(tagBuckets.offSuited, function(tag) {
        preflopHands[tag].setAllOffSuited(true);
      });
      _.each(tagBuckets.both, function(tag) {
        preflopHands[tag].setAll(true);
      });
      _.each(tagBuckets.single, function(tag) {
        this.turnOnSingle(tag);
      }, this);
    };

    this.turnOnSingle = function(tag) {
      var hand = tag.slice(0,2);
      var suit = tag.slice(2,4);
      var onType = (hand[0] === hand[1]) ? 'pairOn' : 'notpair';
      if (onType === 'notpair') {
        onType = (suit[0] === suit[1]) ? 'suitedOn' : 'offSuitedOn';
      }
      preflopHands[hand].combos[suit] = true;  
      preflopHands[hand][onType] = true;  
    };

    this.resetPreflopHands = function() {
      _.each(preflopHands, function(hand) {
        hand.setAll(true); 
        hand.on = false;
        hand.pairOn = false;
        hand.suitedOn = false;
        hand.offSuitedOn = false;
      });
    }


    //tags is array of tags but no spanners ie K7-3
    this.buildTagBuckets = function(tags) {
      var tagBuckets = {
        'suited': [],
        'offSuited' : [],
        'both' : [],
        'single' : []
      };
      _.each(tags, function(tag) {
        if(tag.length === 2) tagBuckets.both.push(tag); 
        else if(tag.length === 4) tagBuckets.single.push(tag);
        else if(tag.length === 3 && tag[2] === 's') tagBuckets.suited.push(tag.slice(0,2)); 
        else if(tag.length === 3 && tag[2] === 'o') tagBuckets.offSuited.push(tag.slice(0,2)); 
      }, this);
      return tagBuckets;
    };

    this.expandRangeTags = function(rangeString) {
      var allTags = [];    
      var rangeTags = rangeString.split(',');    
      _.each(rangeTags, function(rangeTag) {
        rangeTag = rangeTag.trim();
        var tagType = this.getTagType(rangeTag), 
          tags = [rangeTag];
        if (tagType.toLowerCase().indexOf('spanner') !== -1) {
          tags = this.expandRangeTag(rangeTag, tagType);
        }
        allTags = allTags.concat(tags);
      }, this);
      return allTags;
    };

    this.expandRangeTag = function(rangeTag, tagType) {
      var
        cards = 'AKQJT98765432'.split(''),
        expandedTags = [],
        handType = '',
        start = _.indexOf(cards, rangeTag[1]), 
        end = _.indexOf(cards, rangeTag[3]),
        span = cards.splice(start, end-start+1);
     // console.log('span', span, ' st', start, ' end', end);

      if (tagType !== 'pairSpanner') {
        if (tagType === 'suitSpanner') handType = 's';
        else if (tagType === 'offsuitSpanner') handType = 'o';
        expandedTags = _.map(span, function(rCard) {
          return rangeTag[0] + rCard + handType;
        });
      }
      else {
        expandedTags = _.map(span, function(card) {
          return card + card; 
        });
      }
    //  console.log(expandedTags);
      return expandedTags;
      
    };

    this.getTagType = function(rangeTag) {
      //careful refactoring this, order matters with 'pair' and 'both'
      var tagTypes = {
        spanner : /^[A-Z\d]+-[A-Z\d]+$/.test(rangeTag),
        suitSpanner : /^[A-Z\d]+-[A-Z\d]s+$/.test(rangeTag),
        offsuitSpanner : /^[A-Z\d]+-[A-Z\d]o+$/.test(rangeTag),
        pairSpanner : /^([A-Z\d])\1-([A-Z\d])\2$/.test(rangeTag),
        offsuit : /^[A-Z\d][A-Z\d]o$/.test(rangeTag),
        suit : /^[A-Z\d][A-Z\d]s$/.test(rangeTag),
        both : /^[A-Z\d][A-Z\d]$/.test(rangeTag),
        single : /^[A-Z\d][A-Z\d][cdhs][cdhs]$/.test(rangeTag),
        pair : /^([A-Z\d])\1$/.test(rangeTag)
      },
        result = false;
      _.each(tagTypes, function(found,tagType) {
        if (found) result = tagType;; 
      });
      return result;
    };

  };

  return RangeParser;
});
