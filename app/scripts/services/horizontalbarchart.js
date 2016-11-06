'use strict';

rangeStatApp.factory('HorizontalBarChart', ['d3', function(d3) {

  var HorizontalBarChart = function(config) {
    config = config || {};
    this._width = config.width || 700;
    this._height = config.height || 400;
    this._margins = config.margins || {
        top: 0,
        left: 30,
        right: 30,
        bottom: 30
      },
    this._labelWidth = config.labelWidth || 110;
    this._x;
    this._y;
    this._data = [];
    this._svg;
    this._bodyG;
    this._axesG;
    this.percent_of_group = false;
  };

  HorizontalBarChart.prototype = {

    render: function(el, reload) {
      this._x = d3.scale
        .linear()
        .domain([0, 1])
        .range([0, this.quadrantWidth()]);
      this._y = d3.scale
        .linear()
        .domain([0, this._data.length])
        .range([this.quadrantHeight(), 0]);

      if (!this._svg) {
        this._svg = d3.select(el)
      }

      this._svg
        .attr("height", this._height)
        .attr("width", this._width + this._labelWidth);

      this.renderAxes(this._svg, reload);

      this.defineBodyClip(this._svg, reload);

      this.renderBody(this._svg, reload);
    },

    renderAxes: function(svg, reload) {


      var xAxis = d3.svg.axis()
        .scale(this._x)
        .ticks(10)
        .tickFormat(d3.format("%"))
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(this._y)
        .ticks(0)
        .orient("left");

      var labelOffset = parseInt(this.xStart()) + this._labelWidth;
      var yStart = this.yStart();
      var yEnd = this.yEnd();
      if (!this._axesG) {
        this._axesG = this._svg.append("g")
          .attr("class", "axes");

        this._axesG.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", function() {
            return "translate(" + labelOffset + "," + yStart + ")";
          })
          .call(xAxis);

        this._axesG.append("g")
          .attr("class", "axis y-axis")
          .attr("transform", function() {
            return "translate(" + labelOffset + "," + yEnd + ")";
          })
          .call(yAxis);
      }

      if (reload) {
        //keep x-axis transformation incase have to resize for mobile
        this._axesG.select('.x-axis').transition()
          .attr("transform", function() {
            return "translate(" + labelOffset + "," + yStart + ")";
          })
          .call(xAxis);
        this._axesG.select('.y-axis').transition()
          .attr("transform", function() {
            return "translate(" + labelOffset + "," + yEnd + ")";
          })
          .call(yAxis);
      }
    },

    defineBodyClip: function(svg, reload) {
      var padding = 5;

      if (reload) {
        this._svg.transition().select('#body-clip')
          .attr("width", this.quadrantWidth() + 2 * padding + this._labelWidth)
          //.attr("width", this.quadrantWidth() + 2 * padding )
          .attr("height", this.quadrantHeight());
      } else {

        this._svg.append("defs")
          .append("clipPath")
          .attr("id", "body-clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", this.quadrantWidth() + 2 * padding + this._labelWidth)
          .attr("height", this.quadrantHeight());
      }
    },

    renderBody: function(svg, reload) {
      if (reload) {
        this._bodyG.transition()
          .attr("transform", "translate(" + this.xStart() + "," + this.yEnd() + ")")
      } else if (!this._bodyG) {
        this._bodyG = this._svg.append("g")
          .attr("class", "body")
          .attr("transform", "translate(" + this.xStart() + "," + this.yEnd() + ")")
          .attr("clip-path", "url(#body-clip)");
      }

      this.renderBars();
    },

    renderBars: function() {
      var padding = 2;
      var barHeight = Math.floor(this.quadrantHeight() / this._data.length) - padding;
      var _x = this._x;
      var _y = this._y;
      var width = this._width;
      var height = this._height;
      var labelWidth = this._labelWidth;
      var percent = this.percent.bind(this);


      var bars = this._bodyG.selectAll("g").data(this._data, this.key);
      var exit = bars.exit();
      var enter = bars.enter().append("g");

      exit
        .select('rect, text')
        .transition()
        .attr("width", "0")
        .remove();
      exit
        .selectAll('text')
        .remove();
      exit
        .transition()
        .remove();

      enter
        .attr("transform", function(d, i) {
          return "translate(" + labelWidth + "," + (i * (barHeight + padding)) + ")";
        })
        .attr('data-bar', 'bar')
        .attr('data-group', function(d) {
          return d.group;
        });
/*
        .transition()
        .attr("transform", function(d, i) {
          return "translate(" + labelWidth + "," + (i * (barHeight + padding)) + ")";
        });
*/

      enter.append("rect")
        .attr("class", "bar")
        .attr("width", 0);

      //percent label
      enter.append("text");
      this._bodyG.selectAll("text")
        .data(this._data, this.key)
        .transition()
        .attr("x", function(d) {
          var val = percent(d);
          if (val < 0.1) return _x(val) + 30;
          else return _x(val) - 10;
        })
        .attr("class", function(d) {
          if (percent(d) < 0.1) return 'outside';
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) {
          return (100 * percent(d)).toFixed(2) + "%";
        });

      //axis label
      enter.append("text").attr("class", "bar-label");
      this._bodyG.selectAll("text.bar-label")
        .data(this._data, this.key)
        .transition()
        .attr("x", '-10px')
        .attr("y", barHeight / 2)
        .text(function(d) {
          return d.type;
        });

      //resize all bars and add data attrs for tooltip
      this._bodyG.selectAll("rect.bar")
        .data(this._data, this.key)
        .transition()
        .attr("width", function(d) {
          return _x(percent(d));
        })
        .attr("height", function(d) {
          return barHeight;
        })
        .attr('data-combos', function(d) {
          return d.hands;
        })
        .attr('data-hrange', function(d) {
          return d.handRange;
        });

    },


    xStart: function() {
      return this._margins.left;
    },

    yStart: function() {
      return this._height - this._margins.bottom;
    },

    xEnd: function() {
      return this._width - this._margins.right;
    },

    yEnd: function() {
      return this._margins.top;
    },

    quadrantWidth: function() {
      return this._width - this._margins.left - this._margins.right;
    },

    quadrantHeight: function() {
      return this._height - this._margins.top - this._margins.bottom;
    },

    width: function(w) {
      if (!arguments.length) return this._width;
      this._width = w;
      return this;
    },

    height: function(h) {
      if (!arguments.length) return this._height;
      this._height = h;
      return this;
    },

    margins: function(m) {
      if (!arguments.length) return this._margins;
      this._margins = m;
      return this;
    },

    x: function(x) {
      if (!arguments.length) return this._x;
      this._x = x;
      return this;
    },

    y: function(y) {
      if (!arguments.length) return this._y;
      this._y = y;
      return this;
    },

    setData: function(data) {
      this._data = data;
      return this;
    },

    key: function(d) {
      return d.type;
    },

    percent: function(d) {
      return this.percent_of_group ? d.percent_of_group : d.percent;
    },

  }; //prototype

  return HorizontalBarChart


}]);
