'use strict';

rangeStatApp.factory('tagMatrix', ['_', function(_) {

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
        return matrix.reverse();
}]);
