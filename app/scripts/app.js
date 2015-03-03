'use strict';

var rangeStatApp = angular.module('rangeStatApp', [
    'ngResource',
    'ui.router',
    'underscore',
    'd3js'
])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('range', {
          url: "/range/:board/:range",
          views: {
            rangeSelector: {
              templateUrl: "views/base.html",
        //      controller: 'MainCtrl as main'
            },
            rangeChart: {
              templateUrl: "views/rangechart.html",
              controller: 'RangeChartCtrl as rangeChart', 
            }
          }
        })
        .state('index', {
          url: "/",
          template: "<div>INDOX</div>"
        });




    $urlRouterProvider.otherwise('index')

//     $locationProvider.html5Mode(true);

    }]);
