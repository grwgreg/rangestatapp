'use strict';
/*
 * Directive for horizontal bar chart
 */
rangeStatApp.directive('barChart', ['_', 'd3', 'HorizontalBarChart', function(_, d3, HorizontalBarChart) {

  function link(scope, el, attrs) {


    var chart = new HorizontalBarChart();
    chart.setData(scope.data);
    chart.render(el[0]);

    window.el = el;
    //window.x = chart;
    console.log(el);

    //el.mouseover(function(e) {
    /*
      el[0].addEventListener('mouseenter', function(e) {
        var $target = $(e.target);
        if ($target.attr('class') === 'bar') {
          showTip($target);

        var combos = $target[0].getAttribute('data-combos');
        var hrange = $target[0].getAttribute('data-hrange');
        var transform = $target.parent().attr('transform');
        var xyRegex = /\((\d*),(\d*)\)/g;
        var matches = xyRegex.exec(transform);
        var match = parseInt(matches[2]) + 40;
        var height = match + "px";
    //scope.$emit('showTip', combos, hrange,height);
        }
      });
    */
/*
    el.find('.bar').hover(function(e) {
      console.log('in', e);
      if (!$(e.relatedTarget).hasClass('bar-combos')) {
console.log('calling showtip',e);
        showTip($(e.target));
      } else {
console.log('enter bar from bar combos do nothing',e);
return false;
      }
    }, function(e) {
      console.log('out', e);
      if (!$(e.relatedElement).hasClass('bar-combos')) {
console.log(e.relatedTarget);
        console.log('moving to something other than bar combos',e);
        angular.element('.bar-combos').hide();
      } else {
console.log('moving back to bar combos so do nothing',e);
}
      //instead should send a hide tip event
    });


    //this can be in the tool tip directives linking function i think?
    angular.element('.bar-combos').on('mouseout', function(e) {
      console.log('bar combos out, ', e);
      //if (!$(e.toElement).hasClass('bar')) {
      if (!(e.toElement.classList.contains('bar'))) {
        console.log('not moving back to bar,hide');
        $(this).hide();
      } else {
console.log('moving back t obar so dont hide',e);
}
    });
*/

    el.find('.bar').hover(function(e) {
      showTip($(e.target));
      //scope.$emit('showTip', combos, hrange,height);
      e.stopPropagation();
      return false;
    }, function(e) {
      e.stopPropagation();
      return false;
    });

    el.on('mouseover', function() {
      angular.element('.bar-combos').hide();
    //scope.$emit('hideTip', combos, hrange,height);
    });

    function showTip($target) {
      console.log('showing now');
      var combos = $target[0].getAttribute('data-combos');
      var hrange = $target[0].getAttribute('data-hrange');

      var transform = $target.parent().attr('transform');
      var xyRegex = /\((\d*),(\d*)\)/g;
      var matches = xyRegex.exec(transform);

      var matches = parseInt(matches[2]) + 30;
      var height = matches + "px";

      var tip = angular.element('.bar-combos').text(hrange + ' ' + combos).show(); //this should be in tooltip directive
      tip.css('left', '150px');
      tip.css('top', height);
      //scope.tip.height += 10;//lol wut

    }

    /*
      el.mouseout(function(e) {
        var $target = $(e.target);
        var $toElement = $(e.toElement);
        var isBar = $target.attr('class') === 'bar';
        var overTip = $toElement.hasClass('bar-combos');
        if (isBar && !overTip) {
          angular.element('.bar-combos').hide();
    //instead should send a hide tip event
        }
      });
    */

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
