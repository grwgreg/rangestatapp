describe('Directive: preflopHand', function() {
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
    $scope.ranges = preflopHands;
    var matrixString = '<preflop-hand '; 
    matrixString += "cards='ranges.JT' ";
    matrixString += "active='active' ";
    matrixString += "tag='JTo' ";
    matrixString += "hand-type='o' ";
    matrixString += "color='btn-primary'>"; 
    matrixString += "</preflop-hand>";
    el = $compile(matrixString)($scope); 
  }));

  it('has toggles pressed class given the property on the card object', function() {
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(false);
    $scope.ranges['JT'].offSuitedOn = true;
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(true);

    $scope.ranges['JT'].offSuitedOn = false;
    $scope.$digest();
    expect(el.hasClass('pressed')).toBe(false);
  });

  it('should toggle notall class given the property on the card object', function() {
    $scope.$digest();
    expect(el.hasClass('notall')).toBe(false);
    $scope.ranges['JT'].combos.dc = false;
    $scope.$digest();
    expect(el.hasClass('notall')).toBe(true);

    $scope.ranges['JT'].combos.dc = true;
    $scope.$digest();
    expect(el.hasClass('notall')).toBe(false);
  });

});
