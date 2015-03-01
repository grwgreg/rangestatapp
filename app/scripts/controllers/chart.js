
'use strict';

rangeStatApp.controller('ChartCtrl', ['$stateParams', function ($stateParams) {
console.log('inchartctrl');
  var vm = this;
  vm.load = function() {
console.log('loadchart');
    console.log($stateParams);
console.log('loadchart');
  }


  var data = mockRangeData();
  data = JSON.parse(data);
console.log(data);



}]);


function mockRangeData() {
  return '{"pocket_pair":{"percent":0.3076923076923077,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"premium_pocket":{"percent":0.3076923076923077,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"pair":{"percent":0.4230769230769231,"hands":["J9dd","J9hh","J9ss","JTdd","JThh","JTss","KTdd","KThh","KTss","QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]},"oesd":{"percent":0.2692307692307692,"hands":["J9dd","J9hh","J9ss","JTdd","JThh","JTss","KJcd","KJch","KJcs","KJdc","KJdd","KJdh","KJds","KJhc","KJhd","KJhh","KJhs","KJsc","KJsd","KJsh","KJss"]},"gutshot":{"percent":0.34615384615384615,"hands":["QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"]},"pair_plus_flush_draw":{"percent":0.15384615384615385,"hands":["QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KKcd","KKch","KKcs","KKdc","KKhc","KKsc"]},"flush":{"percent":0.02564102564102564,"hands":["KJcc","KQcc"]},"flush_draw":{"percent":0.3076923076923077,"hands":["KJcd","KJch","KJcs","KJdc","KJhc","KJsc","QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KQcd","KQch","KQcs","KQdc","KQhc","KQsc","KKcd","KKch","KKcs","KKdc","KKhc","KKsc"]},"two_pair":{"percent":0.08974358974358974,"hands":["98dd","98hh","T8dd","T8hh","T9dd","T9hh","T9ss"]},"trips":{"percent":0.07692307692307693,"hands":["AAdh","AAds","AAhd","AAhs","AAsd","AAsh"]},"combo_draw":{"percent":0.23076923076923078,"hands":["KJcd","KJch","KJcs","KJdc","KJhc","KJsc","QQcd","QQch","QQcs","QQdc","QQhc","QQsc","KQcd","KQch","KQcs","KQdc","KQhc","KQsc"]},"premium_overs":{"percent":0.19230769230769232,"hands":["KQcd","KQch","KQcs","KQdc","KQdd","KQdh","KQds","KQhc","KQhd","KQhh","KQhs","KQsc","KQsd","KQsh","KQss"]},"mid_pair":{"percent":0.038461538461538464,"hands":["J9dd","J9hh","J9ss"]},"high_pair":{"percent":0.38461538461538464,"hands":["JTdd","JThh","JTss","KTdd","KThh","KTss","QQcd","QQch","QQcs","QQdc","QQdh","QQds","QQhc","QQhd","QQhs","QQsc","QQsd","QQsh","KKcd","KKch","KKcs","KKdc","KKdh","KKds","KKhc","KKhd","KKhs","KKsc","KKsd","KKsh"]}}';
}
