'use strict';

var rangeStatApp = angular.module('rangeStatApp', [
//    'ngCookies',
    'ngResource',
//    'ngSanitize',
 //   'ngRoute',
    'ui.router',
    'underscore'
])
    //.config(['$routeProvider', function ($routeProvider) {
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
/*
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
*/
      $stateProvider
        .state('index', {
          url: "/",
          template: "<div>dis be index</div>",
          controller: function() {console.log('index')} 
        })
        .state('range', {
          url: "/range/:flop/:board",
          templateUrl: "views/base.html",
          controller: 'MainCtrl as main'
        });

//$urlRouterProvider.when('/ex')
$urlRouterProvider.otherwise('/index')
/*
        .state('state1.list', {
          url: "/list",
          templateUrl: "partials/state1.list.html",
          controller: function($scope) {
            $scope.items = ["A", "List", "Of", "Items"];
          }
        });
*/
    }]);
