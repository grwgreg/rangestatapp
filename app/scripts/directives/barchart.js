'use strict';
/*
 * Directive for horizontal bar chart
 */
rangeStatApp.directive('barChart', ['_', 'd3', 'HorizontalBarChart', function(_, d3, HorizontalBarChart) {

  function link(scope, el, attrs) {


    var chart = new HorizontalBarChart();
    chart.setData(scope.data);
    chart.render(el[0]);
    bindBarHover();

    function bindBarHover() {
      el.find('.bar').hover(function(e) {
        var $target = $(e.target);
        var combos = $target[0].getAttribute('data-combos');
        var hrange = $target[0].getAttribute('data-hrange');

        var transform = $target.parent().attr('transform');
        var xyRegex = /\((\d*),(\d*)\)/g;
        var matches = xyRegex.exec(transform);
        var match = parseInt(matches[2]) + 30;
        var height = match + "px";
        scope.$emit('showTip', combos, hrange,height);
        e.stopPropagation();
        return false;
      }, function(e) {
        e.stopPropagation();
        return false;
      });
    }


    el.on('mouseover', function() {
      scope.$emit('hideTip');
    });

    scope.$watch(function() {
      return scope.data;
    }, function() {
      chart.setData(scope.data);
      chart.render(el[0], true);
      bindBarHover();//have to rebind events, can't use event delegation because firefox issue?
    });

    scope.$watch(function() {
      return scope.percentOfGroup;
    }, function() {
      chart.percent_of_group = scope.percentOfGroup;
      chart.render(el[0], true);
    });

  }
  return {
    restrict: 'A',
    scope: {
      data: '=',
      percentOfGroup: '=',
      tip: '='
    },
    link: link
  };
}]);
