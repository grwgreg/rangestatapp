'use strict';

angular.module('rangeStatApp')
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
        on: false, //general on isn't needed I dont think
        pairOn: false,
        suitedOn: false,
        offSuitedOn: false,
        all: function() {
          return _.every(this.combos, _.identity);
        },
        allSuits: function() {
          if (this.combos.length === 6) return false;
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
        allOffSuits: function() {
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

    //$scope.ranges['AK'].offSuitedOn = true;

    $scope.active = {
      cards: $scope.ranges['AK'],
      tag: 'AKo',
      type: 'o'
    };

  }])
  
.directive('preflopHand', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      cards: '=',
      active: '=',
      color: '@',
      tag: '@',
      handType: '@'
    },
    template: '<button type="button" class="{{color}} btn btn-xs" \
              ng-class="{pressed : isOn(), notall : !all()}" ng-click="toggleOn()"> \
              {{tag}}</button>',
    controller: function($scope) { //link works here too
      $scope.toggleOn = function() {                                                   //greg add toggleall for suited!
        $scope.active.cards = $scope.cards;
        $scope.active.tag = $scope.tag;
        $scope.active.type = $scope.handType;
        if ($scope.handType === 'o') {

          $scope.cards.offSuitedOn = !$scope.cards.offSuitedOn;

        } else if ($scope.handType === 'p') {
         
          $scope.cards.pairOn = !$scope.cards.pairOn;

        } else {

          $scope.cards.suitedOn = !$scope.cards.suitedOn;

        }
      }
      $scope.isOn = function() {


        if ($scope.handType === 'o') {

          return $scope.cards.offSuitedOn;

        } else if ($scope.handType === 'p') {

          return $scope.cards.pairOn;

        } else {

          return $scope.cards.suitedOn;          

        }
      };

      $scope.all = function() {

        if ($scope.handType === 'o') {

          return $scope.cards.allOffSuits();

        } else if ($scope.handType === 'p') {

          return $scope.cards.all();

        } else {

          return $scope.cards.allSuits();          

        }
      };
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
        console.log($scope.active.tag);
        $scope.ranges['97'].combos.cc = false;
        $scope.ranges['98'].combos.dc = false;
        $scope.ranges['99'].combos.cd = false;
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
          if (cardData.type == 'o') color = 'btn-primary';  //this belongs in preflop-hand directive controller
          matrixString += '<preflop-hand '; 
          matrixString += "cards='" + hand + "' ";
          matrixString += "active='active' ";
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


.directive('suitMatrix', function() {
  var suits = 'cdhs'.split(''),
    matrix = [];

  _.each(suits, function(colSuit) {
    var row = [];
    _.each(suits, function(rowSuit) {
      row.push(rowSuit + colSuit);
    });
    matrix.push(row);
  });
  console.log(matrix);

  return {
    restrict: 'E',
//    replace: true, //cant replace with no root el
//maybe this can be compile too?
    template: function(el, attr) {
      var matrixString = '{{active.tag}}';
      matrixString += '<ul class="suit-matrix">'; 
      _.each(matrix, function(row) {
        matrixString += '<li>';
        _.each(row, function(suits) {
          matrixString += "<suit-control ";
          matrixString += "active='active'";
      //    matrixString += "ranges='ranges'";
          matrixString += "suits='" + suits + "'>";
      //    matrixString += "activeCombo='active.combo'>";
          matrixString += "</suit-control>";
        }); 
        matrixString += '</li>';
      });
      matrixString += '</ul>';
      return matrixString;
    }
  };
})



.directive('suitControl', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      active: '=',
      suits: '@'
    },
    template: ['<button type="button" class="btn btn-xs btn-primary "', 
              'ng-class="{pressed : isOn()}" ',
              'ng-click="toggleOn()" ', 
              'ng-disabled="isDisabled()">',
              '<span class="{{suitClass1}}"></span>',
              '<span class="{{suitClass2}}"></span>',
              '</button>'].join(''),
    controller: function($scope) { //link works here too
      var comboByType = {
        's' : ['cc', 'dd', 'hh', 'ss'],
        'p' : ['cd', 'ch', 'cs', 'dh', 'ds', 'hs'],
        'o' : ['cd', 'ch', 'cs', 'dc', 'dh', 'ds', 'hc', 'hd', 'hs', 'sc', 'sd', 'sh']
      };

      $scope.isOn = function() {
        return $scope.active.cards.combos[$scope.suits];
      };

      $scope.isDisabled = function() {
        return -1 == _.indexOf(comboByType[$scope.active.type], $scope.suits);
      };

      $scope.toggleOn = function() {
        /*
        var handType = 'p',
          tag = $scope.active.tag, activeCombos = '';
        if ($scope.active.tag.length == 3) {
          handType = tag[2] == 'o' ? 'o' : 's'; //dont need this if you can disable buttons
          tag = tag.slice(0,2);
          console.log(tag);
        }
        activeCombos = $scope.ranges[tag].combos;
        console.log(tag, $scope.hand, $scope.ranges, $scope.suits); 
        activeCombos[$scope.suits] = !activeCombos[$scope.suits];
        console.log('activecomb: ', $scope.activeCombo);
        */
        console.log('fuckme ', $scope.active);
        $scope.active.cards.combos[$scope.suits] = !$scope.active.cards.combos[$scope.suits];
      };


      var suitsClasses = $scope.suits.split('').map(function(suit) {
        if (suit == 'c') return 'club';
        else if (suit == 'd') return "diam";
        else if (suit == 'h') return "heart";
        else return 'spade';
      });
      $scope.suitClass1 = suitsClasses[0];
      $scope.suitClass2 = suitsClasses[1];
    }
  }
})
;
