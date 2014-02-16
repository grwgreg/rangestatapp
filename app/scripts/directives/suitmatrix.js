'use strict';
var _ = window._;//to shut up jshint


rangeStatApp.directive('suitMatrix', function() {
  var suits = 'cdhs'.split(''),
    matrix = [];

  _.each(suits, function(colSuit) {
    var row = [];
    _.each(suits, function(rowSuit) {
      row.push(rowSuit + colSuit);
    });
    matrix.push(row);
  });
  //console.log(matrix);

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
          matrixString += "suits='" + suits + "'>";
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
        return -1 === _.indexOf(comboByType[$scope.active.type], $scope.suits);
      };

      $scope.toggleOn = function() {
        $scope.active.cards.combos[$scope.suits] = !$scope.active.cards.combos[$scope.suits];
      };


      var suitsClasses = $scope.suits.split('').map(function(suit) {
        if (suit === 'c') return 'club';
        else if (suit === 'd') return "diam";
        else if (suit === 'h') return "heart";
        else return 'spade';
      });
      $scope.suitClass1 = suitsClasses[0];
      $scope.suitClass2 = suitsClasses[1];
    }
  };
});
