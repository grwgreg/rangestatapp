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
    var tagBuckets = rangeParser.buildTagBuckets(['KJs', 'KT', '88ch', '85o', '83s']);
    expect(tagBuckets.single.indexOf('88ch') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('KJ') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('83') !== -1).toBe(true);
    expect(tagBuckets.offSuited.indexOf('85') !== -1).toBe(true);
    expect(tagBuckets.both.indexOf('KT') !== -1).toBe(true);
  });
  it('should have method to set all preflopHands combos to false', function() {
    preflopHands.KJ.setAll(true);
    preflopHands.QT.combos.cc = true;
    preflopHands.T5.combos.ds = true;
    rangeParser.resetPreflopHands();
    expect(preflopHands.KJ.all()).toBe(false);
    expect(preflopHands.QT.combos.cc).toBe(false);
    expect(preflopHands.T5.combos.ds).toBe(false);
  });

  it('should have helper to turn on single combos', function() {
    preflopHands['76'].setAll(false);
    rangeParser.turnOnSingle('76hs');
    expect(preflopHands['76'].combos.hs).toBe(true);
    expect(preflopHands['76'].combos.hd).toBe(false);
  });

  it('should have range builder method that reads tagBuckets and sets values on preflopHand object', function() {
      var tagBuckets = {
        'suited': ['KJ', '76', 'QJ',],
        'offSuited' : ['43', '32', 'AT'],
        'both' : ['JJ', '33', 'AK', 'Q6'],
        'single' : ['22hs', '43cd', '98cc', 'AJhc']
      };
    preflopHands.KJ.setAll(false);
    preflopHands.K6.setAll(false);
    preflopHands['43'].setAllOffSuited(false);
    preflopHands['JJ'].setAll(false);
    preflopHands['AK'].setAll(false);
    preflopHands['22'].setAll(false);
    preflopHands['AJ'].setAll(false);

    rangeParser.buildRange(tagBuckets);

    expect(preflopHands.KJ.allSuits()).toBe(true);
    expect(preflopHands.KJ.allOffSuits()).toBe(false);
    expect(preflopHands['76'].allSuits()).toBe(true);
    expect(preflopHands['75'].allSuits()).toBe(false);
    expect(preflopHands['43'].allOffSuits()).toBe(true);
    expect(preflopHands['32'].allOffSuits()).toBe(true);
    expect(preflopHands['AT'].allOffSuits()).toBe(true);
    expect(preflopHands['JJ'].all()).toBe(true);
    expect(preflopHands['33'].all()).toBe(true);
    expect(preflopHands['AK'].all()).toBe(true);
    expect(preflopHands['Q6'].all()).toBe(true);
    expect(preflopHands['22'].combos.hs).toBe(true);
    expect(preflopHands['22'].combos.ch).toBe(false);
    expect(preflopHands['43'].combos.cd).toBe(true);
    expect(preflopHands['98'].combos.cc).toBe(true);
    expect(preflopHands['98'].combos.ss).toBe(false);
    expect(preflopHands['AJ'].combos.hc).toBe(true);
    expect(preflopHands['AJ'].combos.hs).toBe(false);
  });

  it('should have method to parse range strings and set preflop hand objects', function() {
    var rangeString = 'KJs, 76s, QJs, 43o, 32o, ATo, JJ, 33, AK, Q6, 22hs, 43cd, 98cc, AJhc';
    preflopHands.KJ.setAll(false);
    preflopHands.K6.setAll(false);
    preflopHands['43'].setAllOffSuited(false);
    preflopHands['JJ'].setAll(false);
    preflopHands['AK'].setAll(false);
    preflopHands['22'].setAll(false);
    preflopHands['AJ'].setAll(false);

    rangeParser.parseRange(rangeString);

    expect(preflopHands.KJ.allSuits()).toBe(true);
    expect(preflopHands.KJ.allOffSuits()).toBe(false);
    expect(preflopHands['76'].allSuits()).toBe(true);
    expect(preflopHands['75'].allSuits()).toBe(false);
    expect(preflopHands['43'].allOffSuits()).toBe(true);
    expect(preflopHands['32'].allOffSuits()).toBe(true);
    expect(preflopHands['AT'].allOffSuits()).toBe(true);
    expect(preflopHands['JJ'].all()).toBe(true);
    expect(preflopHands['33'].all()).toBe(true);
    expect(preflopHands['AK'].all()).toBe(true);
    expect(preflopHands['Q6'].all()).toBe(true);
    expect(preflopHands['22'].combos.hs).toBe(true);
    expect(preflopHands['22'].combos.ch).toBe(false);
    expect(preflopHands['43'].combos.cd).toBe(true);
    expect(preflopHands['98'].combos.cc).toBe(true);
    expect(preflopHands['98'].combos.ss).toBe(false);
    expect(preflopHands['AJ'].combos.hc).toBe(true);
    expect(preflopHands['AJ'].combos.hs).toBe(false);
  });
});
