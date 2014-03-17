describe('Factory: RangeParser', function () {

  // load the controller's module
  beforeEach(module('rangeStatApp'));

  var rangeParser,
    preflopHands;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_RangeParser_, _preflopHands_) {
    preflopHands = _preflopHands_;
    rangeParser = new _RangeParser_(preflopHands); 
  }))
 
  it('should have method to find rangetag type', function() {
    expect(rangeParser.getTagType('AK-J') === 'spanner').toBe(true);
    expect(rangeParser.getTagType('J3-2o') === 'offsuitSpanner').toBe(true);
    expect(rangeParser.getTagType('T9-4s') === 'suitSpanner').toBe(true);
    expect(rangeParser.getTagType('76-5s') === 'suitSpanner').toBe(true);
    expect(rangeParser.getTagType('TT-44') === 'pairSpanner').toBe(true);
    expect(rangeParser.getTagType('KJ') === 'both').toBe(true);
    expect(rangeParser.getTagType('87s') === 'suit').toBe(true);
    expect(rangeParser.getTagType('K2o') === 'offsuit').toBe(true);
    expect(rangeParser.getTagType('QThs') === 'single').toBe(true);
    expect(rangeParser.getTagType('QQ') === 'pair').toBe(true);
    expect(rangeParser.getTagType('22') === 'pair').toBe(true);
  });
  
  it('should have method to expand rangetags into array of card tags', function() {
    expect(rangeParser.expandRangeTag('76-3', 'spanner').join(',') === '76,75,74,73').toBe(true);
    expect(rangeParser.expandRangeTag('76-3o', 'offsuitSpanner').join(',') === '76o,75o,74o,73o').toBe(true);
    expect(rangeParser.expandRangeTag('76-3s', 'suitSpanner').join(',') === '76s,75s,74s,73s').toBe(true);
    expect(rangeParser.expandRangeTag('77-33', 'pairSpanner').join(',') === '77,66,55,44,33').toBe(true);
  });

  it('should have method to expand multiple range tags into array of card tags', function() {
    expect(rangeParser.expandRangeTags('KJ').join(',') === 'KJ').toBe(true);
    expect(rangeParser.expandRangeTags('KJ, K9').join(',') === 'KJ,K9').toBe(true);
    expect(rangeParser.expandRangeTags('76-3').join(',') === '76,75,74,73').toBe(true);
    expect(rangeParser.expandRangeTags('76-3, AK').join(',') === '76,75,74,73,AK').toBe(true);
    expect(rangeParser.expandRangeTags('76-3, AK-9').join(',') === '76,75,74,73,AK,AQ,AJ,AT,A9').toBe(true);
    expect(rangeParser.expandRangeTags('76-3s, AK-9o').join(',') === '76s,75s,74s,73s,AKo,AQo,AJo,ATo,A9o').toBe(true);
  });

  it('should have method to organize tag strings by type', function() {
    var tagBuckets = rangeParser.buildTagBuckets(['KJs', 'KT', '8c8h', '85o', '83s']);
    expect(tagBuckets.single.indexOf('8c8h') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('KJ') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('83') !== -1).toBe(true);
    expect(tagBuckets.offSuited.indexOf('85') !== -1).toBe(true);
    expect(tagBuckets.both.indexOf('KT') !== -1).toBe(true);
  });
  /*
  it('should have method to parse range strings and set preflop hand objects', function() {
    var tagBuckets = rangeParser.parseRange('KJs, KT, 8c8h, 85o, 83s');
    expect(tagBuckets.single.indexOf('8c8h') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('KJ') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('83') !== -1).toBe(true);
    expect(tagBuckets.offSuited.indexOf('85') !== -1).toBe(true);
    expect(tagBuckets.both.indexOf('KT') !== -1).toBe(true);
  });
  */
});
