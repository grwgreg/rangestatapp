'use strict';
/**
 * A single preflop hand constructor
 */
rangeStatApp.factory('PreflopHand', ['_', function(_) {

  function PreflopHand(isPair) {
    var nonPaired = {
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
      };

    this.combos = isPair ? paired : nonPaired;
    this.on = false;
    this.pairOn = false;
    this.suitedOn = false;
    this.offSuitedOn = false;

  }

  PreflopHand.prototype = {
    checkOn: function(type) {
      switch (type) {
        case 'o':
          return this.offSuitedOn;
        case 's':
          return this.suitedOn;
        case 'p':
          return this.pairOn;
      }
      throw "unknown hand type";
    },
    checkAll: function(type) {
      switch (type) {
        case 'o':
          return this.allOffSuits();
        case 's':
          return this.allSuits();
        case 'p':
          return this.all();
      }
      throw "unknown hand type";
    },
    comboFind: function(type) {
      switch (type) {
        case 'o':
          return this.offSuitedOnCombos();
        case 's':
          return this.suitedOnCombos();
        case 'p':
          return this.allOnCombos();
      }
      throw "unknown hand type";
    },
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
      var suitedCombos = _.map(['cc', 'dd', 'hh', 'ss'], function(suit) {
        return this.combos[suit];
      }, this);
      return _.every(suitedCombos, _.identity);
    },
    suitedOnCombos: function() { //getSuitedOn instead? todo more consistent names
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
      var offSuitTags = _.without(Object.keys(this.combos), 'cc', 'dd', 'hh', 'ss'),
        offSuitObj = {};
      _.each(offSuitTags, function(offSuit) {
        offSuitObj[offSuit] = this.combos[offSuit];
      }, this);
      return offSuitObj;
    },

    setAllBoth: function(bool) {
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
    },

    setAll: function(type, bool) {
      switch (type) {
        case 'offsuits':
          return this.setAllOffSuited(bool);
        case 'suits':
          return this.setAllSuited(bool);
        case 'both':
          return this.setAllBoth(bool);
      }
      throw "unknown hand type";
    }

  };

  return PreflopHand;

}]);
