'use strict';

var rangeStatApp = angular.module('rangeStatApp', [
    'underscore',
    'd3js'
]);

//set to the url of the ruby range server
rangeStatApp.constant('RANGE_SERVER', 'http://localhost:3000/');
