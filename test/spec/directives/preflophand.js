describe('Directive: preflopHand', function() {
  var $compile,
    mockScope,
    el,
    preflopHands,
    activeInputMode;

  beforeEach(module('rangeStatApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, $rootScope, _preflopHands_, _activeInputMode_, $templateCache) {

      mockScope = $rootScope.$new();
      $compile = _$compile_,
      preflopHands = _preflopHands_;
      activeInputMode = _activeInputMode_;


      mockScope.main = {}; 
      mockScope.main.active = activeInputMode;
      mockScope.ranges = preflopHands;
      var template = "<preflop-hand ranks='JT' suit-type='o' active='main.active'></preflop-hand>";
      el = $compile(template)(mockScope); 
  }));

  it('has toggles pressed class given the property on the card object', function() {
    mockScope.$digest();
    expect(el.hasClass('pressed')).toBe(false);
    mockScope.ranges['JT'].offSuitedOn = true;
    mockScope.$digest();
    expect(el.hasClass('pressed')).toBe(true);

    mockScope.ranges['JT'].offSuitedOn = false;
    mockScope.$digest();
    expect(el.hasClass('pressed')).toBe(false);
  });

/*
  it('should toggle notall class given the property on the card object', function() {
    mockScope.$digest();
    expect(el.hasClass('notall')).toBe(false);
    mockScope.ranges['JT'].combos.dc = false;
    mockScope.$digest();
    expect(el.hasClass('notall')).toBe(true);

    mockScope.ranges['JT'].combos.dc = true;
    mockScope.$digest();
    expect(el.hasClass('notall')).toBe(false);
  });
*/

});
