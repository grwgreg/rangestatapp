'use strict';

rangeStatApp.factory('suitMatrix', ['_', function(_) {

  var suits = 'cdhs'.split(''),
    matrix = [];

  _.each(suits, function(colSuit) {
    var row = [];
    _.each(suits, function(rowSuit) {
      row.push(rowSuit + colSuit);
    });
    matrix.push(row);
  });

  return matrix;
}]);
