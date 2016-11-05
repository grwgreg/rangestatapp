'use strict';

rangeStatApp.controller('RangeChartCtrl', ['_', '$scope','$http', function(_, $scope, $http) {
  var vm = this;
  vm.load = function() {
    var x = ['fullHousePlus', 'pairPlusDraw', 'pairs', 'draws', 'overcards', 'main'];
    var r = Math.floor(Math.random() * 6)
    vm.data = chartsData[x[r]];
    vm.group = x[r];
    console.log(vm.tip);
  }

console.log('im so confused');
console.log(this);
console.log($scope.board);
$scope.$watch('board.length',fetchRangeData);
$scope.$watch('range',fetchRangeData);
function fetchRangeData() {
  var range = $scope.range.replace(/\s+/g, '');
  var board = $scope.board.join(',').replace(/\s+/g,'');
  console.log('changed:',range);
  console.log('changed:',board);
  $http({
    method: 'GET',
    url: 'http://localhost:3000/' + board +'/'+range
  }).then(function successCallback(response) {
  console.log('ajaxsuccess');
      var data = JSON.parse(response.data);
  console.log(data);
      var chartsData = buildChartData(data);
      vm.data = chartsData['main'];//this line will be in callback we provide to service or maybe do it
        //via promises in controller, need access to this vm variable?
    }, function errorCallback(response) {
      console.log('ajax error', response);
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
/*
*/



  vm.group = 'main';

  vm.tip = {
    height: 69,
    combos: ['aj', 'kj']
  }

  vm.percentOfGroup = false;

  vm.togglePercentOfGroup = function() {
    return vm.percentOfGroup = !vm.percentOfGroup; 
  };

  vm.changeChart = function($event) {

    if (vm.group !== 'main') {
      vm.group = 'main';
      vm.percentOfGroup = false;
      vm.data = chartsData[vm.group];
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
        vm.data = chartsData[group];
      }
    }
  }



var handGroups = {
  fullHousePlus: ['full_house', 'quads', 'straight_flush'],
  pairPlusDraw: ['pair_plus_gutshot', 'pair_plus_oesd', 'pair_plus_flush_draw', 'pair_plus_over'],
  pairs: ['premium_pocket', 'pocket_pair', 'over_pair', 'top_pair', 'high_pair', 'mid_pair', 'low_pair'],
  draws: ['combo_draw', 'flush_draw', 'oesd', 'doublegut', 'gutshot'],
  overcards: ['ace_high', 'premium_overs', 'over_cards', 'one_over_card'],
  main: ['full_house_plus', 'flush', 'straight', 'trips', 'two_pair', 'pair', 'pair_plus_draw', 'draws', 'overcards']
};
function buildChartData(data) {
  data.full_house_plus.showNext = 'fullHousePlus';
  data.pair_plus_draw.showNext = 'pairPlusDraw';
  data.overcards.showNext = 'overcards';
  data.draws.showNext = 'draws';
  data.pair.showNext = 'pairs';

  var chartsData = {
    main: prepData(data, handGroups.main),
    fullHousePlus: prepData(data, handGroups.fullHousePlus),
    pairPlusDraw: prepData(data, handGroups.pairPlusDraw),
    pairs: prepData(data, handGroups.pairs),
    draws: prepData(data, handGroups.draws),
    overcards: prepData(data, handGroups.overcards),
  }

  return chartsData;
}

  function prepData(data, handGroup) {

    return _.reduce(handGroup, function(m, hand) {
      if (Object.keys(data).indexOf(hand) < 0) return m;
      m.push({
        type: prettyLabel(hand),
        group: nextChart(data[hand], hand),
        percent: data[hand].percent,
        percent_of_group: data[hand].percent_of_group,
        hands: data[hand].hands,
        handRange: data[hand].handRange
      });
      return m;
    }, []);
  }

  function nextChart(d, hand) {
    var keys = _.keys(d);
//lol this should be one liner ternary
    if (keys.indexOf('showNext') > -1) {
      return d.showNext;
    } else {
      return 'main';
    }
  }

  function prettyLabel(s) {
    if (s == 'oesd') return "OE Straight Draw";
    var old = s.split('_');
    var now = _.map(old, function(el) {
      return el[0].toUpperCase() + el.slice(1);
    });
    return now.join(' ');
  }


//data to show on intial load
  var data = mockRangeData();
  data = JSON.parse(data);
  var chartsData = buildChartData(data);
  vm.data = chartsData['main'];


}]);


function mockRangeData() {

//var fullData = '{"straight_flush":{"percent":0.0,"hands":[],"handRange":""},"quads":{"percent":0.0,"hands":[],"handRange":""},"pocket_pair":{"percent":0.19148936170212766,"hands":["TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T"},"premium_pocket":{"percent":0.06382978723404255,"hands":["AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA"},"pair":{"percent":0.425531914893617,"hands":["A7cc","A7dd","A7hh","A7ss","TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","QTcc","QTdd","QThh","QTss","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","QJcc","QJdd","QJhh","QJss","AQcc","AQcd","AQch","AQcs","AQdc","AQdd","AQdh","AQds","AQhc","AQhd","AQhh","AQhs","AQsc","AQsd","AQsh","AQss","AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T,AK-Q,A7s,QJ-Ts"},"straight":{"percent":0.0,"hands":[],"handRange":""},"flush":{"percent":0.0,"hands":[],"handRange":""},"two_pair":{"percent":0.0851063829787234,"hands":["KQcc","KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"],"handRange":"KQ"},"trips":{"percent":0.1276595744680851,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"],"handRange":"KK-Q"},"full_house":{"percent":0.0,"hands":[],"handRange":""},"ace_high":{"percent":0.3191489361702128,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"},"mid_pair":{"percent":0.02127659574468085,"hands":["A7cc","A7dd","A7hh","A7ss"],"handRange":"A7s"},"high_pair":{"percent":0.40425531914893614,"hands":["TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","QTcc","QTdd","QThh","QTss","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","QJcc","QJdd","QJhh","QJss","AQcc","AQcd","AQch","AQcs","AQdc","AQdd","AQdh","AQds","AQhc","AQhd","AQhh","AQhs","AQsc","AQsd","AQsh","AQss","AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T,AK-Q,QJ-Ts"},"low_pair":{"percent":0.0,"hands":[],"handRange":""},"top_pair":{"percent":0.0851063829787234,"hands":["AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss"],"handRange":"AK"},"over_pair":{"percent":0.06382978723404255,"hands":["AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA"},"pair_on_board":{"percent":0.0,"hands":[],"handRange":""},"oesd":{"percent":0.02127659574468085,"hands":["JTcc","JTdd","JThh","JTss"],"handRange":"JTs"},"doublegut":{"percent":0.0,"hands":[],"handRange":""},"gutshot":{"percent":0.19148936170212766,"hands":["J9cc","J9dd","J9hh","J9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-T,J9s"},"pair_plus_gutshot":{"percent":0.0,"hands":[],"handRange":""},"pair_plus_oesd":{"percent":0.0,"hands":[],"handRange":""},"pair_plus_doublegut":{"percent":0.0,"hands":[],"handRange":""},"pair_plus_flush_draw":{"percent":0.0,"hands":[],"handRange":""},"flush_draw":{"percent":0.0,"hands":[],"handRange":""},"flush_draw_on_board":{"percent":0.0,"hands":[],"handRange":""},"pair_plus_gut":{"percent":0.0,"hands":[],"handRange":""},"pair_plus_over":{"percent":0.0,"hands":[],"handRange":""},"oesd_on_board":{"percent":0.0,"hands":[],"handRange":""},"gutshot_on_board":{"percent":0.0,"hands":[],"handRange":""},"doublegut_on_board":{"percent":0.0,"hands":[],"handRange":""},"combo_draw":{"percent":0.0,"hands":[],"handRange":""},"over_cards":{"percent":0.0,"hands":[],"handRange":""},"one_over_card":{"percent":0.3191489361702128,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"},"premium_overs":{"percent":0.0,"hands":[],"handRange":""},"full_house_plus":{"percent":0.0,"hands":[],"handRange":""},"draws":{"percent":0.2127659574468085,"hands":["JTcc","JTdd","JThh","JTss","J9cc","J9dd","J9hh","J9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-T,JT-9s"},"pair_plus_draw":{"percent":0.0,"hands":[],"handRange":""},"overcards":{"percent":0.3191489361702128,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"}}';
var fullData = '{"straight_flush":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"quads":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pocket_pair":{"percent":0.19148936170212766,"percent_of_group":0.45,"hands":["TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T"},"premium_pocket":{"percent":0.06382978723404255,"percent_of_group":0.15,"hands":["AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA"},"pair":{"percent":0.425531914893617,"percent_of_group":0,"hands":["A7cc","A7dd","A7hh","A7ss","TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","QTcc","QTdd","QThh","QTss","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","QJcc","QJdd","QJhh","QJss","AQcc","AQcd","AQch","AQcs","AQdc","AQdd","AQdh","AQds","AQhc","AQhd","AQhh","AQhs","AQsc","AQsd","AQsh","AQss","AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T,AK-Q,A7s,QJ-Ts"},"straight":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"flush":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"two_pair":{"percent":0.0851063829787234,"percent_of_group":0,"hands":["KQcc","KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"],"handRange":"KQ"},"trips":{"percent":0.1276595744680851,"percent_of_group":0,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"],"handRange":"KK-Q"},"full_house":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"ace_high":{"percent":0.3191489361702128,"percent_of_group":1.0,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"},"mid_pair":{"percent":0.02127659574468085,"percent_of_group":0.05,"hands":["A7cc","A7dd","A7hh","A7ss"],"handRange":"A7s"},"high_pair":{"percent":0.40425531914893614,"percent_of_group":0.95,"hands":["TTcd","TTch","TTcs","TTdc","TTdh","TTds","TThc","TThd","TThs","TTsc","TTsd","TTsh","QTcc","QTdd","QThh","QTss","JJcd","JJch","JJcs","JJdc","JJdh","JJds","JJhc","JJhd","JJhs","JJsc","JJsd","JJsh","QJcc","QJdd","QJhh","QJss","AQcc","AQcd","AQch","AQcs","AQdc","AQdd","AQdh","AQds","AQhc","AQhd","AQhh","AQhs","AQsc","AQsd","AQsh","AQss","AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss","AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA,JJ-T,AK-Q,QJ-Ts"},"low_pair":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"top_pair":{"percent":0.0851063829787234,"percent_of_group":0.2,"hands":["AKcc","AKcd","AKch","AKcs","AKdc","AKdd","AKdh","AKds","AKhc","AKhd","AKhh","AKhs","AKsc","AKsd","AKsh","AKss"],"handRange":"AK"},"over_pair":{"percent":0.06382978723404255,"percent_of_group":0.15,"hands":["AAcd","AAch","AAcs","AAdc","AAdh","AAds","AAhc","AAhd","AAhs","AAsc","AAsd","AAsh"],"handRange":"AA"},"pair_on_board":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"oesd":{"percent":0.02127659574468085,"percent_of_group":0.1,"hands":["JTcc","JTdd","JThh","JTss"],"handRange":"JTs"},"doublegut":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"gutshot":{"percent":0.19148936170212766,"percent_of_group":0.9,"hands":["J9cc","J9dd","J9hh","J9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-T,J9s"},"pair_plus_gutshot":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pair_plus_oesd":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pair_plus_doublegut":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pair_plus_flush_draw":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"flush_draw":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"flush_draw_on_board":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pair_plus_gut":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"pair_plus_over":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"oesd_on_board":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"gutshot_on_board":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"doublegut_on_board":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"combo_draw":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"over_cards":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"one_over_card":{"percent":0.3191489361702128,"percent_of_group":1.0,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"},"premium_overs":{"percent":0.0,"percent_of_group":0.0,"hands":[],"handRange":""},"full_house_plus":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"draws":{"percent":0.2127659574468085,"percent_of_group":0,"hands":["JTcc","JTdd","JThh","JTss","J9cc","J9dd","J9hh","J9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-T,JT-9s"},"pair_plus_draw":{"percent":0.0,"percent_of_group":0,"hands":[],"handRange":""},"overcards":{"percent":0.3191489361702128,"percent_of_group":0,"hands":["A2cc","A2dd","A2hh","A2ss","A3cc","A3dd","A3hh","A3ss","A4cc","A4dd","A4hh","A4ss","A5cc","A5dd","A5hh","A5ss","A6cc","A6dd","A6hh","A6ss","A8cc","A8dd","A8hh","A8ss","A9cc","A9dd","A9hh","A9ss","ATcc","ATcd","ATch","ATcs","ATdc","ATdd","ATdh","ATds","AThc","AThd","AThh","AThs","ATsc","ATsd","ATsh","ATss","AJcc","AJcd","AJch","AJcs","AJdc","AJdd","AJdh","AJds","AJhc","AJhd","AJhh","AJhs","AJsc","AJsd","AJsh","AJss"],"handRange":"AJ-8s,A6-2s,AJ-To"}}';
return fullData;
//return riverData;
//return flopData
}

