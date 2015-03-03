'use strict';

rangeStatApp.factory('HorizontalBarChart', ['d3', function(d3) {

 var HorizontalBarChart = function(config) {
    config = config || {};
    this._width = config.width || 700;
    this._height = config.height || 500;
    this._margins = config.margins || { top: 0, left: 30, right: 30, bottom: 30 },
    this._labelWidth = config.labelWidth || 110;
    this._x;
    this._y;
    this._data = [];
    this._svg;
    this._bodyG;
  };

  HorizontalBarChart.prototype = {

    render: function (el) {
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
                    .attr("height", this._height)
                    .attr("width", this._width + this._labelWidth);

            this.renderAxes(this._svg);

            this.defineBodyClip(this._svg);
        }
        this.renderBody(this._svg);
    },

    renderAxes: function (svg) {
        var axesG = this._svg.append("g")
                .attr("class", "axes");

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
        
        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + labelOffset + "," + yStart + ")";
                })
                .call(xAxis);

        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + labelOffset + "," + yEnd + ")";
                })
                .call(yAxis);
    },


    defineBodyClip: function(svg) {
        var padding = 5;

        this._svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.quadrantWidth() + 2 * padding)
                .attr("height", this.quadrantHeight());
    },

    renderBody: function(svg) {
        if (!this._bodyG) {
            this._bodyG = this._svg.append("g")
            .attr("class", "body")
            .attr("transform", "translate(" 
                    + this.xStart() 
                    + "," 
                    + this.yEnd() + ")")
            .attr("clip-path", "url(#body-clip)");
        }

        this.renderBars();
    },

    renderBars: function() {
        var padding = 2;
        var barHeight =  Math.floor(this.quadrantHeight() / this._data.length) - padding;
        var _x = this._x;
        var _y = this._y;
        var labelWidth = this._labelWidth;
        var bars = this._bodyG.selectAll("g")
                .data(this._data, this.key)
                .enter()
                .append("g")
                .attr("transform", function(d,i) { return "translate(" + labelWidth +"," + (i * (barHeight + padding)) + ")"; });

        bars.append("rect")
          .attr("class", "bar")
          .attr("height", function (d) { 
              return barHeight;
          });

        this._bodyG.selectAll("rect.bar")
          .data(this._data, this.key)                    
          .transition()
          .attr("width", function(d){
              return _x(d.percent);
          });

        bars.append("text");
        this._bodyG.selectAll("text")
            .data(this._data, this.key)                    
            .transition()
            .attr("x", function(d) { 
                var val =  d.percent; 
                if (val < 0.1) return _x(d.percent) + 30;
                else return _x(d.percent) - 10;
              })
            .attr("class", function(d) { 
              if (d.percent < 0.1) return 'outside';
              })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return (100 * d.percent).toFixed(2) + "%"; });

        bars.append("text").attr("class", "bar-label");
        this._bodyG.selectAll("text.bar-label")
          .data(this._data, this.key)                    
          .transition()
          .attr("x", '-10px')
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.type; });
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

    width: function (w) {
        if (!arguments.length) return this._width;
        this._width = w;
        return this;
    },

    height: function (h) {
        if (!arguments.length) return this._height;
        this._height = h;
        return this;
    },

    margins: function (m) {
        if (!arguments.length) return this._margins;
        this._margins = m;
        return this;
    },

    x: function (x) {
        if (!arguments.length) return this._x;
        this._x = x;
        return this;
    },

    y: function (y) {
        if (!arguments.length) return this._y;
        this._y = y;
        return this;
    },

    setData: function (data) {
        this._data = data;
        return this;
    },

    key: function(d) {
      return d.type;
    }

  };//prototype

 return HorizontalBarChart


}]);
