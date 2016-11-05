'use strict';

rangeStatApp.controller('MainCtrl', ['$scope', '$rootScope', 'preflopHands', 'activeInputMode', function ($scope, $rootScope, preflopHands, activeInputMode) {

    var vm = this;    
    vm.preflopHands = preflopHands;
    vm.active = activeInputMode;
    vm.board=[];

/*
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
      vm.rangeStringModel = toParams.range;
      vm.rangeStringDummy = toParams.range;
      vm.board = toParams.board.split(',');
    });
should I set initial values here?
*/
      vm.rangeStringModel = '';
      vm.rangeStringDummy = '';
      vm.board = [];

}])

    
.directive('deb', function() {
    return {
        restrict: 'E',
        replace: true,
        template: function() { return['<button type="button" class="btn btn-xs"',
                            'ng-click="deb()">DEBUG</button>'].join('');},
        controller: ['$scope', function($scope) { //link works here too
            $scope.deb = function() {
                console.log($scope.main.board);
                console.log($scope.main.preflopHands);
            };
        }]
    };
});
