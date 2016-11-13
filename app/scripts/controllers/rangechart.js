'use strict';

rangeStatApp.controller('RangeChartCtrl', ['_', '$scope', '$http', 'chartData', 'rangeData', function(_, $scope, $http, chartData, rangeData) {
  var vm = this;

  vm.range = $scope.range;
  //vm.board = $scope.board.join(',');
  vm.board = $scope.board;
  vm.inSync = true;
  vm.group = 'main';
  vm.percentOfGroup = false;
  vm.tip = {};
  vm.suitIcons = {
    c: 'club',
    d: 'diam',
    h: 'heart',
    s: 'spade'
  };
  
  //data to show on intial load
  var initData = chartData.initialData;
  initData = JSON.parse(initData);
  var data = chartData.prepareData(initData);
  vm.data = data['main'];

  $scope.$on('showTip',function(e,combos,hrange,height) {
    $scope.$apply(function() {
      vm.tip.combos = combos.replace(/,/g, ', ');
      vm.tip.hrange = hrange.replace(/,/g, ', ');
      vm.tip.height = height;
      vm.tip.visible = true;
    });
  });

  $scope.$on('hideTip',function(e) {
    $scope.$apply(function() {
      vm.tip.visible = false;
    });
  });

  $scope.$watch('board.length', onRangeChange);
  $scope.$watch('range', onRangeChange);

  function onRangeChange() {
    vm.inSync = false; //display spinner
    debouncedFetch();
  }

  function fetchRangeData() {
    var range = $scope.range.replace(/\s+/g, '');
    var boardArr = $scope.board.slice();
    var board = $scope.board.join(',').replace(/\s+/g, '');
    if (board.length < 6) return;
    rangeData.get({range: range, board: board}).then(function(response) {

      var curRange = $scope.range.replace(/\s+/g, '');
      var curBoard = $scope.board.join(',').replace(/\s+/g, '');
      if (curBoard !== board || curRange !== range) {
        vm.inSync = false;
      } else {
        vm.inSync = true;
      }

      vm.board = boardArr;
      vm.range = range;

      var replyData = JSON.parse(response.data);
      data = chartData.prepareData(replyData);
      vm.data = data[vm.group];

    }, function (response) {
      console.log('ajax error', response);
    });
  }

  var debouncedFetch = _.debounce(fetchRangeData, 1000);

  vm.togglePercentOfGroup = function() {
    return vm.percentOfGroup = !vm.percentOfGroup;
  };

  vm.changeChart = function($event) {

    if (vm.group !== 'main') {
      vm.group = 'main';
      vm.percentOfGroup = false;
      vm.data = data[vm.group];
      return;
    }

    var $el = $($event.target);
    var $group = $el.closest('g');
    if ($group.data('bar') == 'bar') {
      var group = $group.data('group');
      var groupKeys = _.keys(chartData.handGroups);
      var changeGroup = (groupKeys.indexOf(group) > -1) && (group != vm.group);
      if (changeGroup) {
        vm.group = group;
        vm.percentOfGroup = group !== 'main';
        vm.data = data[group];
      }
    }
  }

}]);
