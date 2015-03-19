
'use strict';

rangeStatApp.controller('RangeChartCtrl', ['$stateParams', '_', function ($stateParams, _) {
  var vm = this;
  vm.load = function() {
var x = ['fullHousePlus', 'pairPlusDraw', 'pairs', 'draws', 'overcards', 'main'];
//var x = ['overcards', 'main'];
var r = Math.floor(Math.random()*6)
    vm.data = chartsData[x[r]];
    vm.group = x[r];
console.log('loadfn');
  }
 
  vm.group = 'main';


vm.changeChart = function($event) {
console.log('chart click');
console.log($event);
console.log('chart click');

if (vm.group !== 'main') {
  vm.group = 'main';
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
console.log('groupchanged');
    vm.group = group;
    vm.data = chartsData[group];
  } 
}
}

  var data = mockRangeData();
  data = JSON.parse(data);

var handGroups = {
  fullHousePlus: ['full_house', 'quads', 'straight_flush'],
  pairPlusDraw: ['pair_plus_gutshot', 'pair_plus_oesd', 'pair_plus_flush_draw', 'pair_plus_over'],
  pairs: ['premium_pocket','pocket_pair', 'over_pair', 'top_pair', 'high_pair','mid_pair','low_pair'],
  draws: ['combo_draw', 'flush_draw', 'oesd', 'doublegut','gutshot'],
  overcards: ['ace_high','premium_overs','over_cards','one_over_card'],
  main: ['Fullhouse+', 'flush', 'straight', 'trips', 'two_pair', 'pair', 'Pair Plus Draw', 'Draws', 'Over Cards']
};


var extraData = {
  'Fullhouse+':  {
     percent: percentSum(handGroups.fullHousePlus),
     hands: [mergeHandArrays(handGroups.fullHousePlus)],
showNext: 'fullHousePlus'
  },
  'Pair Plus Draw': {
    percent: percentSum(handGroups.pairPlusDraw),
    hands: [mergeHandArrays(handGroups.pairPlusDraw)],
showNext: 'pairPlusDraw'
   },
  'Draws': {
    percent: percentSum(_.difference(handGroups.draws, ['combo_draw'])),
    hands: [mergeHandArrays(_.difference(handGroups.draws, ['combo_draw']))],
showNext: 'draws'
  },
  'Over Cards': {
    percent: percentSum(handGroups.overcards),
    hands: [mergeHandArrays(handGroups.overcards)],
showNext: 'overcards'
  }
};

data = _.extend(data, extraData); 

var chartsData = {
  main: prepData(data, handGroups.main),
  fullHousePlus: prepData(data, handGroups.fullHousePlus),
  pairPlusDraw: prepData(data, handGroups.pairPlusDraw),
  pairs: prepData(data, handGroups.pairs),
  draws: prepData(data, handGroups.draws),
  overcards: prepData(data, handGroups.overcards),
}

function prepData(data, handGroup) {
  return _.reduce(handGroup, function(m, hand) {
    m.push({
      type: prettyLabel(hand),
      group: nextChart(data[hand], hand),      
      percent: data[hand].percent,
      hands: data[hand].hands 
    });
    return m;
  }, []);
}

function nextChart(d, hand) {
var keys = _.keys(d);
if (keys.indexOf('showNext') > -1) {
  return d.showNext;
} else if (hand == 'pair') {
  return 'pairs';
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

function mergeHandArrays(hands) {
  return _.reduce(hands, function(m,hand) {
    return m.concat(data[hand].hands);
  }, []);
}

function percentSum(hands) {
  return _.reduce(hands, function(m, hand) {
    return data[hand].percent + m; 
  }, 0);
}

vm.data = chartsData['main'];



}]);


function mockRangeData() {
return '{"straight_flush":{"percent":0.0,"hands":[]},"quads":{"percent":0.0,"hands":[]},"pocket_pair":{"percent":0.3076923076923077,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"premium_pocket":{"percent":0.3076923076923077,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"pair":{"percent":0.4230769230769231,"hands":["J9dd","J9hh","J9ss","JTdd","JThh","JTss","KTdd","KThh","KTss","QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"straight":{"percent":0.0,"hands":[]},"oesd":{"percent":0.2692307692307692,"hands":["J9dd","J9hh","J9ss","JTdd","JThh","JTss","KJcd","KJch","KJcs","KJdc","KJdd","KJdh","KJds","KJhc","KJhd","KJhh","KJhs","KJsc","KJsd","KJsh","KJss"]},"doublegut":{"percent":0.0,"hands":[]},"gutshot":{"percent":0.34615384615384615,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"]},"pair_plus_gutshot":{"percent":0.0,"hands":[]},"pair_plus_oesd":{"percent":0.0,"hands":[]},"pair_plus_doublegut":{"percent":0.0,"hands":[]},"pair_plus_flush_draw":{"percent":0.15384615384615385,"hands":["QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KKcd","KKch","KKcs","KKdc","KKhc","KKsc"]},"flush":{"percent":0.02564102564102564,"hands":["KJcc","KQcc"]},"flush_draw":{"percent":0.3076923076923077,"hands":["KJcd","KJch","KJcs","KJdc","KJhc","KJsc","QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KQcd","KQch","KQcs","KQdc","KQhc","KQsc","KKcd","KKch","KKcs","KKdc","KKhc","KKsc"]},"flush_draw_on_board":{"percent":0.0,"hands":[]},"two_pair":{"percent":0.08974358974358974,"hands":["98dd","98hh","T8dd","T8hh","T9dd","T9hh","T9ss"]},"trips":{"percent":0.07692307692307693,"hands":["AAdh","AAds","AAhd","AAhs","AAsd","AAsh"]},"full_house":{"percent":0.0,"hands":[]},"pair_plus_gut":{"percent":0.0,"hands":[]},"pair_plus_over":{"percent":0.0,"hands":[]},"oesd_on_board":{"percent":0.0,"hands":[]},"gutshot_on_board":{"percent":0.0,"hands":[]},"doublegut_on_board":{"percent":0.0,"hands":[]},"combo_draw":{"percent":0.23076923076923078,"hands":["KJcd","KJch","KJcs","KJdc","KJhc","KJsc","QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KQcd","KQch","KQcs","KQdc","KQhc","KQsc"]},"ace_high":{"percent":0.0,"hands":[]},"over_cards":{"percent":0.0,"hands":[]},"one_over_card":{"percent":0.0,"hands":[]},"premium_overs":{"percent":0.19230769230769232,"hands":["KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"]},"mid_pair":{"percent":0.038461538461538464,"hands":["J9dd","J9hh","J9ss"]},"high_pair":{"percent":0.38461538461538464,"hands":["JTdd","JThh","JTss","KTdd","KThh","KTss","QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"low_pair":{"percent":0.0,"hands":[]},"top_pair":{"percent":0.0,"hands":[]},"over_pair":{"percent":0.0,"hands":[]},"pair_on_board":{"percent":0.0,"hands":[]}}';
}
