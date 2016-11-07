'use strict';

rangeStatApp.controller('BoardMatrixCtrl', [function () {

  var vm = this;
  vm.ranks = "AKQJT98765432".split('');
  vm.suits = "cdhs".split('');

  vm.suitIcon = {
    c: 'club',
    d: 'diam',
    h: 'heart',
    s: 'spade'
  };

}]);
