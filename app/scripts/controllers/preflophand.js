'use strict';

rangeStatApp.controller('PreflopHandCtrl', ['$scope', 'preflopHands', function($scope, preflopHands) {

  var vm = this;
  vm.ranks = $scope.ranks;
  vm.suitType = $scope.suitType;
  vm.active = $scope.active;

  var tag = vm.ranks + vm.suitType;
  var twoCardHand = preflopHands[vm.ranks];
  vm.tag = vm.suitType === 'p' ? vm.ranks : tag;

  vm.toggleOn = function() {
    vm.active.cards = twoCardHand;
    vm.active.tag = tag;
    vm.active.type = vm.suitType;
    vm.active.inputMode = 'cardmatrix';
    if (vm.suitType === 'o') twoCardHand.offSuitedOn = !twoCardHand.offSuitedOn;
    else if (vm.suitType === 'p') twoCardHand.pairOn = !twoCardHand.pairOn;
    else twoCardHand.suitedOn = !twoCardHand.suitedOn;
  };

  vm.isOn = function() {
    if (vm.suitType === 'o') return twoCardHand.offSuitedOn;
    else if (vm.suitType === 'p') return twoCardHand.pairOn;
    else return twoCardHand.suitedOn;
  };

  vm.all = function() {
    if (vm.suitType === 'o') return twoCardHand.allOffSuits();
    else if (vm.suitType === 'p') return twoCardHand.all();
    else return twoCardHand.allSuits();
  };

}]);
