'use strict';

angular.module('flopzillaApp')
  .factory('preflopHands', function() {
      
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
        on: false,
        all: function() {
          return _.every(this.combos, _.identity);
        },
        suited: function() {
          if (this.combos.length === 6) return false;
          var suitedCombos = _.map(['cc','dd','hh','ss'], function(suit) {
            return this.combos[suit];
          }, this);
          return _.every(suitedCombos, _.identity);
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
  })

  .controller('MainCtrl', ['$scope', 'preflopHands', function ($scope, preflopHands) {

    $scope.ranges = preflopHands;

  }])
  
.directive('preflopHand', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      cards: '=',
      color: '@',
      tag: '@' 
    },
    template: '<button type="button" class="{{color}} btn btn-xs" \
              ng-class="{pressed : cards.on}" ng-click="toggleOn()"> \
              {{tag}}</button>',
    controller: function($scope) { //link works here too
      $scope.toggleOn = function() {                                                   //greg add toggleall for suited!
        $scope.cards.on = !$scope.cards.on;
        console.log($scope.cards);
      }
    }
  };
})

.directive('deb', function() {
  return {
    restrict: 'E',
    replace: true,
    //template: '<span ng-click="add()">{{it }}</span>',
    template: function() { return['<button type="button" class="btn btn-xs"',
              'ng-click="deb()">DEBUG</button>'].join('')},
    controller: function($scope) { //link works here too
      $scope.deb = function() {
        console.log($scope.ranges);
      }
    }
  };
})

//put card matrix logic in a factory too
.directive('cardMatrix', function() {
  var cardCols = '23456789TJQKA'.split(''),
    cardRows = cardCols.slice().reverse(),
    matrix = [];

  _.each(cardCols, function(colCard, colIndex) {
    var row = [];
    _.each(cardRows, function(rowCard, rowIndex) {
      var type = '',
      printType = '';
      if (colIndex + rowIndex > 12) type = 's';
      if (colIndex + rowIndex === 12) type = 'p';
      if (colIndex + rowIndex < 12) type = 'o';
      var tag = (type == 's') ? colCard + rowCard : rowCard + colCard;
      row.push({cards: tag, type: type});
    });
    matrix.push(row);
  });
  matrix = matrix.reverse();
  console.log(matrix);

  return {
    restrict: 'E',
    //replace: true,
    compile: function(el, attr) {
      var matrixString = '<ul class="card-matrix">'; 
      _.each(matrix, function(row) {
        matrixString += '<li>';
        _.each(row, function(cardData) {
          var hand = 'ranges.' + cardData.cards,
            printType = (cardData.type === 'p') ? '' : cardData.type,
            tag = cardData.cards + printType,
            color = '';
          if (cardData.type == 's') color = 'btn-info'; 
          if (cardData.type == 'p') color = 'btn-success'; 
          if (cardData.type == 'o') color = 'btn-primary'; 
          matrixString += '<preflop-hand '; 
          matrixString += "cards='" + hand + "' ";
          matrixString += "tag='" + tag + "' ";
          matrixString += "color='" + color + "'>"; 
          matrixString += "</preflop-hand>";
        }); 
        matrixString += '</li>';
      });
      matrixString += '</ul>';
      //el.html(matrixString);
      el.replaceWith(matrixString);
    }
  };
})
;
