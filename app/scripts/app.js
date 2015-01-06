'use strict';

var rangeStatApp = angular.module('rangeStatApp', [
//    'ngCookies',
    'ngResource',
//    'ngSanitize',
    'ngRoute',
    'underscore'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
