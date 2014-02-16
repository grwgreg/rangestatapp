'use strict';
var _ = window._;//to shut up jshint

/**
 * Creates the card matrix. Perhaps the output should be captured
 * and hardcoded in the index.html for faster load time.
 */
//put card matrix logic in a factory too
rangeStatApp.directive('cardMatrix', function() {
    var cardCols = '23456789TJQKA'.split(''),
      cardRows = cardCols.slice().reverse(),
      matrix = [];

    _.each(cardCols, function(colCard, colIndex) {
      var row = [];
      _.each(cardRows, function(rowCard, rowIndex) {
        var type = '',
        printType = '';
        if (colIndex + rowIndex > 12) type = 's';
        else if (colIndex + rowIndex === 12) type = 'p';
        else if (colIndex + rowIndex < 12) type = 'o';
        var tag = (type === 's') ? colCard + rowCard : rowCard + colCard;
        row.push({cards: tag, type: type});
      });
      matrix.push(row);
    });
    matrix = matrix.reverse();
    //console.log(matrix);

    return {
      restrict: 'E',
      //replace: true,
      compile: function(el, attr) {
        var matrixString = '<ul class="card-matrix">';
        _.each(matrix, function(row) {
          matrixString += '<li>';
          _.each(row, function(cardData) {
            var hand = 'ranges.' + cardData.cards,
              printType = (cardData.type === 'p') ? '' : cardData.type,
              tag = cardData.cards + printType,
              color = '';
            if (cardData.type === 's') color = 'btn-info'; //make this ifelse statements 
            else if (cardData.type === 'p') color = 'btn-success';
            else if (cardData.type === 'o') color = 'btn-primary';  //this belongs in preflop-hand directive controller
            matrixString += '<preflop-hand ';
            matrixString += "cards='" + hand + "' ";
            matrixString += "active='active' ";
            matrixString += "tag='" + tag + "' ";
            matrixString += "hand-type='" + cardData.type + "' ";
            matrixString += "color='" + color + "'>";
            matrixString += "</preflop-hand>";
          });
          matrixString += '</li>';
        });
        matrixString += '</ul>';
        el.replaceWith(matrixString);
      }
    };
  });
