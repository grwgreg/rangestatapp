'use strict';

rangeStatApp.controller('RangeChartCtrl', ['_', '$scope', '$http', 'chartData', function(_, $scope, $http, chartData) {
  var vm = this;
  var data;

  vm.tip = {};
  $scope.$on('showTip',function(e,combos,hrange,height) {
    $scope.$apply(function() {
      vm.tip.combos = combos;
      vm.tip.hrange = hrange;
      vm.tip.height = height;
      vm.tip.visible = true;
    });
  });

  $scope.$on('hideTip',function(e) {
    $scope.$apply(function() {
      vm.tip.visible = false;
    });
  });

  $scope.$watch('board.length', fetchRangeData);
  $scope.$watch('range', fetchRangeData);


  function fetchRangeData() {
    vm.inSync = false; //display spinner
    debouncedRequest();
  }
  var makeRequest = function() {
    var range = $scope.range.replace(/\s+/g, '');
    var board = $scope.board.join(',').replace(/\s+/g, '');
    if (range.trim() === '' || board.length < 6) return;//todo
    $http({
      method: 'GET',
      url: 'http://localhost:3000/' + board + '/' + range
    }).then(function successCallback(response) {
      // console.log('ajaxsuccess');

      var curRange = $scope.range.replace(/\s+/g, '');
      var curBoard = $scope.board.join(',').replace(/\s+/g, '');
      if (curBoard !== board || curRange !== range) {
        console.log('the board or range has since changed');
        vm.inSync = false;
      } else {
        vm.inSync = true;
      }

      vm.board = board;
      vm.range = range;



      var replyData = JSON.parse(response.data);
      data = chartData.prepareData(replyData);
      vm.data = data[vm.group];
      //via promises in controller, need access to this vm variable?
    }, function errorCallback(response) {
      console.log('ajax error', response);
    });
  };

  var debouncedRequest = _.debounce(makeRequest, 500);

  //initial range and board
  vm.range = $scope.range;
  vm.board = $scope.board.join(',');
  vm.inSync = true;
  vm.group = 'main';
  vm.percentOfGroup = false;

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
      var groupKeys = _.keys(handGroups);
      var changeGroup = (groupKeys.indexOf(group) > -1) && (group != vm.group);
      if (changeGroup) {
        vm.group = group;
        vm.percentOfGroup = group !== 'main';
        vm.data = data[group];
      }
    }
  }





  //data to show on intial load
  var initData = chartData.initialData;
  initData = JSON.parse(initData);
  data = chartData.prepareData(initData);
  vm.data = data['main'];


}]);



