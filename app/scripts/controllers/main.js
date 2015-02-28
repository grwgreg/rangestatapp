'use strict';

rangeStatApp.controller('MainCtrl', ['$scope', 'preflopHands', 'activeInputMode', '$stateParams', function ($scope, preflopHands, activeInputMode, $stateParams) {

console.log( ' main loaded' );
console.log($stateParams);


    var vm = this;    
    vm.preflopHands = preflopHands;
    vm.active = activeInputMode;
   
    vm.rangeStringDummy = 'AA';
    vm.rangeStringModel = 'AA';

$scope.$watch(function() {return vm.rangeStringModel}, function() {
console.log(vm.rangeStringModel);

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
                console.log($scope.main.preflopHands);
                console.log($scope.main.active.tag);
                $scope.main.preflopHands['97'].combos.cc = false;
                $scope.main.preflopHands['98'].combos.dc = false;
                $scope.main.preflopHands['99'].combos.cd = false;
            };
        }]
    };
});
