'use strict';
var _ = window._;//to shut up jshint

/**
 * The main preflop hand object
 */
rangeStatApp.factory('preflopHands', function() {

    var ranges = {},
      cards = '23456789TJQKA'.split(''),
      nonPaired = {
        cc: true,
        dd: true,
        hh: true,
        ss: true,
        cd: true,
        ch: true,
        cs: true,
        dc: true,
        dh: true,
        ds: true,
        hc: true,
        hd: true,
        hs: true,
        sc: true,
        sd: true,
        sh: true
      },
      paired = {
        cd: true,
        ch: true,
        cs: true,
        dh: true,
        ds: true,
        hs: true,
      },
      handProto = {
        on: false, //general on isn't needed I dont think
        pairOn: false,
        suitedOn: false,
        offSuitedOn: false,
        all: function() {
          return _.every(this.combos, _.identity);
        },
        allOnCombos: function() {
          var found = [];
          _.each(this.combos, function(val, key) {
            if (this.combos[key]) found.push(key);
          }, this);
          return found;
        },
        allSuits: function() {
          if (this.combos.length === 6) return false;
          var suitedCombos = _.map(['cc','dd','hh','ss'], function(suit) {
            return this.combos[suit];
          }, this);
          return _.every(suitedCombos, _.identity);
        },
        suitedOnCombos: function() {//getSuitedOn instead? these names are sloppy and confusing
          var found = [];
          _.each(['cc', 'dd', 'hh', 'ss'], function(suit) {
            if (this.combos[suit]) found.push(suit);
          }, this);
          return found;
        },
        allOffSuits: function() {
          if (this.combos.length === 6) return false;
          return _.every(_.toArray(this.offSuits()), _.identity);
        },
        offSuitedOnCombos: function() {
          var found = [];
          _.each(this.offSuits(), function(val, key) {
            if (this.combos[key]) found.push(key);
          }, this);
          return found;
        },
        offSuits: function() {
          var offSuitTags =  _.without(Object.keys(this.combos), 'cc', 'dd', 'hh', 'ss'),
            offSuitObj = {};
          _.each(offSuitTags, function(offSuit) {
            offSuitObj[offSuit] = this.combos[offSuit];
          }, this);
          return offSuitObj;
        },
        setAll: function(bool) {
          this.on = bool;
          this.pairOn = bool;
          this.suitedOn = bool;
          this.offSuitedOn = bool;
          _.each(this.combos, function(val, key) {
            this.combos[key] = bool;
          }, this);
        },
        setAllSuited: function(bool) {
          if (this.combos.length === 6) return false;
          this.suitedOn = bool;
          _.each(['cc', 'dd', 'hh', 'ss'], function(suit) {
            this.combos[suit] = bool;
          }, this);
        },
        setAllOffSuited: function(bool) {
          if (this.combos.length === 6) return false;
          this.offSuitedOn = bool;
          _.each(this.offSuits(), function(val, key, obj) {
            this.combos[key] = bool;
          }, this);
        }
      };

    _.each(cards, function(rcard) {
      var lCards = cards.slice(cards.indexOf(rcard));
      _.each(lCards, function(lcard) {
        var type = (lcard === rcard) ? paired : nonPaired;
        ranges[lcard + rcard] = _.extend({combos: _.clone(type)}, handProto);
      });
    });

    return ranges; //change this name to preflophands maybe
  });
