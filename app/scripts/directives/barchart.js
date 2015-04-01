'use strict';
 /*
  * Directive for horizontal bar chart
  */
rangeStatApp.directive('barChart', ['_', 'd3', 'HorizontalBarChart', function(_, d3, HorizontalBarChart) {

function link(scope, el, attrs) {

  var chart = new HorizontalBarChart();
  chart.setData(scope.data);
  chart.render(el[0]);

  //window.el = el;
  //window.x = chart;

  el.mouseover(function(e) {
    var $target = $(e.target);
    if ($target.attr('class') === 'bar') {
      showTip($target);
    }
  });


  angular.element('.bar-combos').on('mouseout', function() {
    $(this).hide();
  });

  function showTip($target) {
    var combos = $target.data('combos');
    var tip = angular.element('.bar-combos').text(combos).show();

    var transform = $target.parent().attr('transform');
    var xyRegex = /\((\d*),(\d*)\)/g;
    var matches = xyRegex.exec(transform);

    var matches = parseInt(matches[2]) + 40;
    var height = matches + "px";

    tip.css('left', '150px');
    tip.css('top', height);

  }

  el.mouseout(function(e) {
    var $target = $(e.target);
    var $toElement = $(e.toElement);
    var isBar = $target.attr('class') === 'bar';
    var overTip = $toElement.hasClass('bar-combos');
    if (isBar && !overTip) {
      angular.element('.bar-combos').hide();
    }
  });

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


