'use strict';
 /*
  * Directive for horizontal bar chart
  */
rangeStatApp.directive('chart', ['_', function(_) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                suit: '@',
                rank: '@',
                board: '='
            },
            templateUrl: '/views/boardcard.html', 
            controller: ['$scope', function($scope) {
  
            }] 
        };
    }]);

/*
function barChart() {
    var _chart = {};

    var _width = 800, _height = 500,
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _x, _y,
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _bodyG;

    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select("body").append("svg")
                    .attr("height", _height)
                    .attr("width", _width);

            renderAxes(_svg);

            defineBodyClip(_svg);
        }

        renderBody(_svg);
    };

    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        var xAxis = d3.svg.axis()
                .scale(_x.range([0, quadrantWidth()]))
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");

        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);

        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);
    }

    function defineBodyClip(svg) {
        var padding = 5;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                            + xStart() 
                            + "," 
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");

        renderBars();
    }
    
    function renderBars() {
        var padding = 2; // <-A
        
        var barHeight =  Math.floor(quadrantHeight() / _data.length) - padding;
console.log(_bodyG);
        var bars = _bodyG.selectAll("g")
                .data(_data)
                .enter()
                .append("g") // <-B
                .attr("transform", function(d,i) { return "translate(0," + (i * (barHeight + padding)) + ")"; });


        bars.append("rect")
          .attr("class", "bar")
          .attr("height", function (d) { 
              //return Math.floor(quadrantHeight() / _data.length) - padding;
              return barHeight;
          });

//need to make another selection... forget why it works like this?
//greg next day- because bars is the enter selection, with new data but same objs so empty selection
    _bodyG.selectAll("rect.bar")
                .data(_data)                    
//

          .transition()
          .attr("width", function(d){
              return _x(d.x);
          });

    bars.append("text");
//
    _bodyG.selectAll("text")
                .data(_data)                    
        .transition()
//
        .attr("x", function(d) { 
            var val =  d.x; 
            if (val < 1) return _x(d.x) + 30;
            else return _x(d.x) - 10;
          })
        .attr("class", function(d) { 
          if (d.x < 1) return 'outside';
          })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.x.toFixed(2); });
    
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };

    _chart.setSeries = function (series) {
        _data = series;
        return _chart;
    };

    return _chart;
}

function randomData() {
    return Math.random() * 9;
}

function update() {
    data.length = 0;
    for (var j = 0; j < numberOfDataPoint; ++j)
        data.push({y: j, x: randomData()});    

    chart.render();
}

var numberOfDataPoint = 15,
    data = [];

data = d3.range(numberOfDataPoint).map(function (i) {
    return {x: randomData(), y: i};
});

var chart = barChart()
        .x(d3.scale.linear().domain([0, 10]))
        .y(d3.scale.linear().domain([0, 15]));


chart.setSeries(data);

chart.render();
*/

