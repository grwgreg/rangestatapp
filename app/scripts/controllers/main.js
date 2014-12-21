'use strict';

rangeStatApp.controller('MainCtrl', ['$scope', 'preflopHands', 'activeInputMode', function ($scope, preflopHands, activeInputMode) {

        $scope.main = {};
        $scope.main.preflopHands = preflopHands;
        $scope.main.active = activeInputMode;

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
