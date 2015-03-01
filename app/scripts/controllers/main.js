'use strict';

rangeStatApp.controller('MainCtrl', ['$scope', '$rootScope', 'preflopHands', 'activeInputMode', '$state', '$stateParams', function ($scope, $rootScope, preflopHands, activeInputMode, $state, $stateParams) {

    var vm = this;    
    vm.preflopHands = preflopHands;
    vm.active = activeInputMode;
    vm.board=[];

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
      vm.rangeStringModel = toParams.range;
      vm.rangeStringDummy = toParams.range;
      vm.board = toParams.board.split(',');
    });

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
            };
        }]
    };
});
