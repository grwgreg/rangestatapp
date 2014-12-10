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
      if (rangeString.trim() === '') return this.resetPreflopHands();
      var tags = this.expandRangeTags(rangeString);
      var tagBuckets = this.buildTagBuckets(tags);
      this.buildRange(tagBuckets);
    };

    this.buildRange = function(tagBuckets) {
      this.resetPreflopHands();
      //dry?
      _.each(tagBuckets.suited, function(tag) {
        preflopHands[tag].setAllSuited(true);
      });
      _.each(tagBuckets.offSuited, function(tag) {
        preflopHands[tag].setAllOffSuited(true);
      });
      _.each(tagBuckets.both, function(tag) {
        preflopHands[tag].setAll(true);
      });
      _.each(tagBuckets.single, function(singles) {
        this.turnOnSingles(tagBuckets);
      }, this);
    };

    //this method is an abomination
    this.turnOnSingles = function(tagBuckets) {
      var singles = tagBuckets.single;
      _.each(singles, function(combos, tag) {
        var alreadyOn = 'none';
        var onTypes = [];
        if (tagBuckets.both.indexOf(tag) !== -1) {
          console.log(tag, 'inboth');
          return;//already on
        } else {
          if (tagBuckets.suited.indexOf(tag) !== -1) {
            console.log(tag, 'insuitedbucket');
            alreadyOn = 'suited';
          }
          if (tagBuckets.offSuited.indexOf(tag) !== -1) {
            console.log(tag, 'inoffsuitedbucket');
            alreadyOn = 'offSuited';
          }
        }
        //make above new method
        //whts left below can be shortened with methodmap
        if (alreadyOn === 'suited') {
          preflopHands[tag].setAllOffSuited(false);
          _.each(combos, function(combo) {
            preflopHands[tag].combos[combo] = true;
            var onType = (combo[0] === combo[1]) ? 'suited' : 'offSuited';
            onTypes =_.union([onType], onTypes);
            console.log('the tag: ', tag, 'onTypes: ', onTypes);
          }, this);
        }
        if (alreadyOn === 'offSuited') {
          preflopHands[tag].setAllSuited(false);
          _.each(combos, function(combo) {
            preflopHands[tag].combos[combo] = true;
            var onType = (combo[0] === combo[1]) ? 'suited' : 'offSuited';
            onTypes =_.union([onType], onTypes);
          }, this);
        }
        if (alreadyOn === 'none') {
          preflopHands[tag].setAll(false);
          _.each(combos, function(combo) {
            preflopHands[tag].combos[combo] = true;
            var onType = (combo[0] === combo[1]) ? 'suited' : 'offSuited';
            onTypes = _.union([onType], onTypes);
          }, this);
        }
        //omg this is so terrible
        if (onTypes.indexOf('suited') !== -1) preflopHands[tag].suitedOn = true;
        if (onTypes.indexOf('offSuited') !== -1) preflopHands[tag].offSuitedOn = true;
        if (tag[0] === tag[1]) preflopHands[tag].pairOn = true;
      }, this);

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
        'single' : {}//hash of arrays of suits keyed by 2card tag 
      };

      _.each(tags, function(tag) {
        if(tag.length === 2) tagBuckets.both.push(tag);
        else if(tag.length === 4) this.addSingle(tag, tagBuckets);
        /*
        else if(tag.length === 4) tagBuckets.single.push(tag);
        */
        else if(tag.length === 3 && tag[2] === 's') tagBuckets.suited.push(tag.slice(0,2));
        else if(tag.length === 3 && tag[2] === 'o') tagBuckets.offSuited.push(tag.slice(0,2));
      }, this);
      return tagBuckets;
    };

    this.addSingle = function(tag, tagBuckets) {
      var hand = tag.slice(0,2);
      var suit = tag.slice(2,4);
      if (tagBuckets.single.hasOwnProperty(hand)) {//greg you can remove this if and just use line 152
        tagBuckets.single[hand].push(suit);
      } else {
        tagBuckets.single[hand] = tagBuckets.single[hand] || [];
        tagBuckets.single[hand].push(suit);
      }
    }

    /*getTagType returns the type then above we use conditions to break up into
     * different tag buckets again, never using this data. just add to the correct
     * tagbucket within this function maybe?
     */
    this.expandRangeTags = function(rangeString) {
      var allTags = [];    
      var rangeTags = rangeString.split(',');    
      _.each(rangeTags, function(rangeTag) {
        /*todo just check return type of getTagType instead of try/catch, kindagross*/
        try {
          rangeTag = rangeTag.trim();
          var tagType = this.getTagType(rangeTag), 
            tags = [rangeTag];
          if (tagType.toLowerCase().indexOf('spanner') !== -1) {
            tags = this.expandRangeTag(rangeTag, tagType);
          }
          allTags = allTags.concat(tags);
        } catch(err) {
          throw 'invalid tag';
        }
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
