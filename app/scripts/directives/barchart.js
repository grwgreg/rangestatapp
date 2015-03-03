'use strict';
 /*
  * Directive for horizontal bar chart
  */
rangeStatApp.directive('barChart', ['_', 'd3', 'HorizontalBarChart', function(_, d3, HorizontalBarChart) {
function link(scope, el, attrs) {
console.log('iloaded');
/*strt of link*/
console.log(el[0]);
console.log('iloaded');

/*
function _barChart() {
    var _chart = {};
*/

var chart = new HorizontalBarChart();

chart.setData(scope.data);

chart.render(el[0]);


var newdata = [];
setTimeout(function() {

  _.each(scope.data, function(el, i) {
     el.percent += .2;
     newdata.push(el);
  });

newdata = _.shuffle(newdata);
newdata.pop();
chart.setData(newdata);
chart.render();

}, 5000);














/*end of link*/
}
        return {
            restrict: 'A',
            scope: {
              data: '='
            },
            link: link
        };
    }]);


