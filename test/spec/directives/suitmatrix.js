describe('Directive: suitControl', function() {
  var $compile,
    $scope,
    el,
    preflopHands;

  beforeEach(module('rangeStatApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _preflopHands_) {
      $scope = _$rootScope_,
      $compile = _$compile_,
      preflopHands = _preflopHands_;
    $scope.active = {
      cards: preflopHands['QT'],
      tag: 'QTo',
      type: 'o'
    };
    var matrixString = "<suit-control ";
    matrixString += "active='active'";
    matrixString += "suits='ch'>";
    matrixString += "</suit-control>";
    el = $compile(matrixString)($scope); 
  }));

  it('creates span children with correct suit class', function() {
    $scope.$digest();
    expect(el.find('span').eq(0).hasClass('club')).toBe(true);
    expect(el.find('span').eq(1).hasClass('heart')).toBe(true);
  });

  it('has toggle click handler that will toggle combo val and pressed class', function() {
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(true);
    $scope.active.cards.combos.ch = false;
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(false);

    $scope.active.cards.combos.ch = true;
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(true);

  });

  it('should have isDisabled method on isolate scope', function() {
    $scope.$digest();
    expect(el.isolateScope().isDisabled()).toBe(false);

    $scope.active.type = 's';
    $scope.$digest();
    expect(el.isolateScope().isDisabled()).toBe(true); 

    $scope.active.type = 'p';
    el.isolateScope().suits = 'dd';
    $scope.$digest();
    expect(el.isolateScope().isDisabled()).toBe(true); 

    $scope.active.type = 's';
    el.isolateScope().suits = 'dd';
    $scope.$digest();
    expect(el.isolateScope().isDisabled()).toBe(false); 
  });
});
