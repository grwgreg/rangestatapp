'use strict';

angular.module('flopzillaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  //clean up above eventually
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
    };

  _.each(cards, function(rcard) {
    var lCards = cards.slice(cards.indexOf(rcard));
    _.each(lCards, function(lcard) {
      var type = (lcard === rcard) ? paired : nonPaired;
      ranges[lcard + rcard] = {  //use extend here with all function and on object extended with combos
        on: false,
      all: true,
      combos: _.clone(type) 
      };
    });    
  });

  $scope.ranges = ranges;

  });
