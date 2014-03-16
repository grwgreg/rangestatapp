'use strict';
var _ = window._;

rangeStatApp.factory('RangeParser', function() {

  //todo
  //write method on range parser to turn off all combos in preflopHands
  //theres nowhere else sensible to put it, maybe split this obj eventually
  //into RangeParser and preflopHandsHandler or something
  //
  //write methods directly on the preflopHands combo prototype
  //that are found in the methodMap below
  //
  //write method to toggle on single cards, ie parse out the
  //suit combo and just toggle it to true
  var RangeParser = function(preflopHands) {


    var handTypes = {
      suited: ['suitSpanner', 'suited'],
      offsuited: ['offsuitSpanner', 'offsuit'],
      both: ['both']
    };


    //rangeString is the input field value
    this.parseRange = function(rangeString) {
      var tags = _.map(rangeString.split(','), function(el) {
        return el.trim(); 
      });
      var tagBuckets = this.buildTagBuckets(tags);
      _.each(tagBuckets, function(tags, rangeType) {
        this.toggleTags(tags, rangeType); 
      }, this);
      return tagBuckets;
    };

    //tags is array of tags no spanners set in this.buildTagBuckets
    //rangeType is key of tagBuckets
    this.toggleTags = function(tags, rangeType) {
      var methodMap = {
        'suited' : 'toggleSuited',
        'offSuited' : 'toggleOffSuited',
        'both' : 'toggleAll'
      }
      //need to reset all tags to off somehow... should this be on the prototype
      _.each(tags, function(tag) {
        if (rangeType) === 'single' {
          preflopHands[tag][suitCombo] = true;
        } else {
        preflopHands[tag][methodMap[rangeType]]();
        }
      });
    };

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
        else if(tag.length === 4) tagBuckets.single.push(tag);//parse which suit in range handler method 
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
