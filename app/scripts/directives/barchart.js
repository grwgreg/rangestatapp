'use strict';
 /*
  * Directive for horizontal bar chart
  */
rangeStatApp.directive('barChart', ['_', 'd3', 'HorizontalBarChart', function(_, d3, HorizontalBarChart) {

function link(scope, el, attrs) {

  var chart = new HorizontalBarChart();
  chart.setData(scope.data);
  chart.render(el[0]);

  //window.el = el[0];
  //window.x = chart;

  scope.$watch(function() {
      return scope.data;
    }, function() {
      chart.setData(scope.data);
      chart.render(el[0], true);
  });

}
        return {
            restrict: 'A',
            scope: {
              data: '='
            },
            link: link
        };
    }]);


