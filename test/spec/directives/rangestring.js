describe('Directive: rangeString', function() {
  var $compile,
    $scope,
    el,
    preflopHands;

  beforeEach(module('templates'));
  beforeEach(module('rangeStatApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _preflopHands_, _activeInputMode_) {
      $scope = _$rootScope_,
      $compile = _$compile_,
      preflopHands = _preflopHands_,
      activeInputMode = _activeInputMode_,
      activeInputMode.inputMode = 'cardmatrix';
      $scope.main = {},
      $scope.main.active = _activeInputMode_,
      $scope.main.rangeStringModel = '',
      $scope.main.preflopHands = preflopHands;

    var template = "<input class='range-string' ng-model='main.rangeStringModel' active-input-mode='main.active' \
      range-string preflop-hands='main.preflopHands' type='text'>";

    el = $compile(template)($scope); 


  }));

  it('Changes to preflophand obj trigger formatter and set input value', function() {
    $scope.$digest();
    expect(el.val()).toBe('');
    el.scope().main.preflopHands['KJ'].offSuitedOn = true;
    el.scope().main.preflopHands['QJ'].suitedOn = true;
    activeInputMode.inputMode = 'cardmatrix';
    el.scope().$digest();
    expect(el.val()).toEqual('KJo, QJs')
  });

  it('parses input value and sets preflophands object values', function() {
    $scope.$digest();
    $scope.main.rangeStringModel = 'KJ',
    $scope.$digest();
    expect(preflopHands['KJ'].offSuitedOn).toBe(true);
  });


});
