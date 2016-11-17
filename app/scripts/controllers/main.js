'use strict';

rangeStatApp.controller('MainCtrl', ['preflopHands', 'activeInputMode', function (preflopHands, activeInputMode) {

    var vm = this;    
    vm.preflopHands = preflopHands;
    vm.active = activeInputMode;

    //initial data to display
    vm.rangeStringModel = 'AK-T,KQ-J,KTs,QJ-Ts,AA-88,AK-2s,JT-9s,T9-8s,98s,87s,76s';
    vm.rangeStringDummy = 'AK-T,KQ-J,KTs,QJ-Ts,AA-88,AK-2s,JT-9s,T9-8s,98s,87s,76s';
    vm.board = ['Ks','8h','9h'];

}]);
