'use strict';

rangeStatApp.controller('preflopHandCtrl', ['$scope', 'preflopHands', function ($scope, preflopHands) {

    var tag = $scope.ranks + $scope.suitType;
    var twoCardHand = preflopHands[$scope.ranks];
    $scope.tag = $scope.suitType === 'p' ? $scope.ranks : tag;

    $scope.color = function() {
        if ($scope.suitType === 's') return 'btn-info'; 
        else if ($scope.suitType === 'p') return 'btn-success';
        else if ($scope.suitType === 'o') return 'btn-primary';
    };


    $scope.toggleOn = function() {
        $scope.active.cards = twoCardHand;
        $scope.active.tag = tag;
        $scope.active.type = $scope.suitType;
        $scope.active.inputMode = 'cardmatrix';
        if ($scope.suitType === 'o') twoCardHand.offSuitedOn = !twoCardHand.offSuitedOn;
        else if ($scope.suitType === 'p') twoCardHand.pairOn = !twoCardHand.pairOn;
        else twoCardHand.suitedOn = !twoCardHand.suitedOn;
    };

    $scope.isOn = function() {
        if ($scope.suitType === 'o') return twoCardHand.offSuitedOn;
        else if ($scope.suitType === 'p') return twoCardHand.pairOn;
        else return twoCardHand.suitedOn;
    };

    $scope.all = function() {
        if ($scope.suitType === 'o') return twoCardHand.allOffSuits();
        else if ($scope.suitType === 'p') return twoCardHand.all();
        else return twoCardHand.allSuits();
    };

}]);
