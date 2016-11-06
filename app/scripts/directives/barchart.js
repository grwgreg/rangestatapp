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

/*greg todo
  make a 'tip' directive that takes as props the combos, handrange and position, pass in scope vars
*/
  function showTip($target) {
    var combos = $target[0].getAttribute('data-combos');
    var hrange = $target[0].getAttribute('data-hrange');
    var tip = angular.element('.bar-combos').text(hrange + ' ' + combos).show();

    var transform = $target.parent().attr('transform');
    var xyRegex = /\((\d*),(\d*)\)/g;
    var matches = xyRegex.exec(transform);

    var matches = parseInt(matches[2]) + 40;
    var height = matches + "px";

    tip.css('left', '150px');
    tip.css('top', height);
    scope.tip.height += 10;//lol wut

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


