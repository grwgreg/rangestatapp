describe('Directive: handSuits', function() {
  var $compile,
    $scope,
    el,
    preflopHands;

  beforeEach(module('templates'));
  beforeEach(module('rangeStatApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _preflopHands_, _activeInputMode_) {
      $scope = _$rootScope_,
      $compile = _$compile_,
      activeInputMode = _activeInputMode_,
      $scope.main = {},
      $scope.main.active = _activeInputMode_,
      preflopHands = _preflopHands_;
    activeInputMode.cards = preflopHands['QT'];
    activeInputMode.tag = 'QTo';
    activeInputMode.type = 'o';
    activeInputMode.inputMode = 'cardmatrix';

    var template = '<hand-suits active="main.active" suits="sc"></hand-suits>';
    el = $compile(template)($scope); 


  }));

  it('creates span children with correct suit class', function() {
    $scope.$digest();
    expect(el.find('span').eq(0).hasClass('spade')).toBe(true);
    expect(el.find('span').eq(1).hasClass('club')).toBe(true);
  });

  it('toggles single combos on the main preflophands obj', function() {
    expect(preflopHands['QT'].combos.sc).toBe(true);
    $scope.$digest();
    el.triggerHandler('click');
    expect(preflopHands['QT'].combos.sc).toBe(false);
    el.triggerHandler('click');
    expect(preflopHands['QT'].combos.sc).toBe(true);
  });

});
