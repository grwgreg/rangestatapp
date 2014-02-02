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
        suited: function() { //rename this allSuits
          if (this.combos.length === 6) return false;
          //suitedcombos is an array of [true, true, false, true]
          var suitedCombos = _.map(['cc','dd','hh','ss'], function(suit) {
            return this.combos[suit];
          }, this);
          return _.every(suitedCombos, _.identity);
        },
        toggleSuited: function() { //this methods useless, change to set all to true or false, take as param
          if (this.combos.length === 6) return false;
          _.each(['cc', 'dd', 'hh', 'ss'], function(suit) {
            this.combos[suit] = !this.combos[suit];
          }, this);
        },
        offSuited: function() {
          if (this.combos.length === 6) return false;
          return _.every(_.toArray(this.offSuits()), _.identity);
        },
        toggleOffSuited: function() {
          if (this.combos.length === 6) return false;
          console.log('this.offsuits: ', this.offSuits());
          _.each(this.offSuits(), function(val, key, obj) {
            this.combos[key] = !this.combos[key];
          }, this);
        },
        offSuits: function() {
          var offSuitTags =  _.without(Object.keys(this.combos), 'cc', 'dd', 'hh', 'ss'),
            offSuitObj = {};
          _.each(offSuitTags, function(offSuit) {
             offSuitObj[offSuit] = this.combos[offSuit]; 
          }, this);
          return offSuitObj;
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
      tag: '@',
      handType: '@'
    },
    template: '<button type="button" class="{{color}} btn btn-xs" \
              ng-class="{pressed : isOn()}" ng-click="toggleOn()"> \
              {{tag}}</button>',
    controller: function($scope) { //link works here too
      $scope.toggleOn = function() {                                                   //greg add toggleall for suited!
        $scope.alwayspressed = !$scope.alwayspressed;
        if ($scope.handType === 'o') {

          $scope.cards.toggleOffSuited();

        } else if ($scope.handType === 'p') {
//write a toggle all method and use here
         
        } else {
          $scope.cards.toggleSuited();          
        }
      }
      $scope.isOn = function() {

//add a pairOn, offsuitedOn, and suitedOn attributes to top hands object
//its very possible the toggle methods are useless :(
//but the suited() and offsuited() methods are still usefull for determining
//the color of the button
//i guess can use the toggles as references for clear and all methods too
//
//next step is to add the pairOn type attributes, just booleans and replace
//above
//
//then add a new class for 'all' which will show if its been edited fine grain
//the function to determine that checks the offsuited() type methods
//then in css make .pressed.finegrain class that changes color to orange
//or something

        if ($scope.handType === 'o') {
          return $scope.cards.offSuited();
        } else if ($scope.handType === 'p') {
          return $scope.cards.all();
        } else {
          return $scope.cards.suited();          
        }
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
          if (cardData.type == 's') color = 'btn-info'; //make this ifelse statements 
          if (cardData.type == 'p') color = 'btn-success'; 
          if (cardData.type == 'o') color = 'btn-primary'; 
          matrixString += '<preflop-hand '; 
          matrixString += "cards='" + hand + "' ";
          matrixString += "tag='" + tag + "' ";
          matrixString += "hand-type='" + cardData.type + "' ";
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
