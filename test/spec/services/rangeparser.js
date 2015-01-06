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

  it('should have addSingle helper method to add single card sags to tagBuckets', function() {
    var tagBuckets = {
      'suited': [],
      'offSuited' : [],
      'both' : [],
      'single' : {}//hash of arrays of suits keyed by 2card tag 
    };
    rangeParser.addSingle('KTsc', tagBuckets);
    rangeParser.addSingle('83sc', tagBuckets);
    rangeParser.addSingle('KTss', tagBuckets);
    rangeParser.addSingle('K4sc', tagBuckets);
    expect(tagBuckets.single['KT'].indexOf('sc') !== -1).toBe(true);
    expect(tagBuckets.single['KT'].indexOf('ss') !== -1).toBe(true);
    expect(tagBuckets.single['KT'].length === 2).toBe(true);
  });

  it('should have buildTagBuckets method to organize tag strings by type', function() {
    var tagBuckets = rangeParser.buildTagBuckets(['KJs', 'KT', '88ch', '85o', '83s']);
    expect(tagBuckets.suited.indexOf('KJ') !== -1).toBe(true);
    expect(tagBuckets.suited.indexOf('83') !== -1).toBe(true);
    expect(tagBuckets.offSuited.indexOf('85') !== -1).toBe(true);
    expect(tagBuckets.both.indexOf('KT') !== -1).toBe(true);
  });

  it('should have method to set all preflopHands to off and their combos to true', function() {
    preflopHands.QT.combos.cc = false;
    preflopHands.QT.suitedOn = true;
    preflopHands.T5.combos.ds = false;
    preflopHands.T5.offSuitedOn = true;

    rangeParser.resetPreflopHands();

    expect(preflopHands.QT.combos.cc).toBe(true);
    expect(preflopHands.QT.suitedOn).toBe(false);
    expect(preflopHands.T5.combos.ds).toBe(true);
    expect(preflopHands.T5.offSuitedOn).toBe(false);
  });

  it('should have helper to turn on singles combos', function() {
    var singles = {
      '83': ['sc'],
      'KT': ['sc', 'ss'],
      'K4': ['sh', 'ds', 'cd'],
      '55' : ['cs', 'hs']
    };
    var tagBuckets = {
      'suited': ['K4', '76', 'QJ',],
      'offSuited' : ['KT', '32', 'AT'],
      'both' : ['JJ', '83', 'AK', 'Q6', '99'],
      'single' : singles
    };
    rangeParser.turnOnSingles(tagBuckets);
    expect(preflopHands['K4'].combos.sd).toBe(false);
    expect(preflopHands['K4'].combos.sc).toBe(false);
    expect(preflopHands['K4'].combos.hc).toBe(false);
    expect(preflopHands['K4'].combos.sh).toBe(true);
    expect(preflopHands['K4'].combos.ds).toBe(true);
    expect(preflopHands['K4'].combos.cd).toBe(true);
    expect(preflopHands['K4'].offSuitedOn).toBe(true);

    expect(preflopHands['55'].combos.cs).toBe(true);
    expect(preflopHands['55'].combos.hs).toBe(true);
    expect(preflopHands['55'].combos.ds).toBe(false);
    expect(preflopHands['55'].combos.dh).toBe(false);
    expect(preflopHands['55'].combos.cd).toBe(false);
    expect(preflopHands['55'].pairOn).toBe(true);

    expect(preflopHands['99'].combos.cs).toBe(true);
    expect(preflopHands['99'].combos.hs).toBe(true);
    expect(preflopHands['99'].combos.ds).toBe(true);
    expect(preflopHands['99'].combos.dh).toBe(true);
    expect(preflopHands['99'].combos.cd).toBe(true);
    //in this test pairOn is never set because already set
    expect(preflopHands['99'].pairOn).toBe(false);
  });
  it('should have parseRange method take a string and populate the preflophands object', function() {
    rangeParser.parseRange('AKo, KQs, K4sh, K4ds, K4cd, 55, 99cs, QT-8');
    expect(preflopHands['K4'].combos.sd).toBe(false);
    expect(preflopHands['K4'].combos.sc).toBe(false);
    expect(preflopHands['K4'].combos.hc).toBe(false);
    expect(preflopHands['K4'].combos.sh).toBe(true);
    expect(preflopHands['K4'].combos.ds).toBe(true);
    expect(preflopHands['K4'].combos.cd).toBe(true);

    expect(preflopHands['55'].combos.cs).toBe(true);
    expect(preflopHands['55'].combos.hs).toBe(true);
    expect(preflopHands['55'].combos.ds).toBe(true);
    expect(preflopHands['55'].combos.dh).toBe(true);
    expect(preflopHands['55'].combos.cd).toBe(true);

    expect(preflopHands['99'].combos.cs).toBe(true);
    expect(preflopHands['99'].combos.hs).toBe(false);

    expect(preflopHands['QT'].all()).toBe(true);
    expect(preflopHands['Q9'].all()).toBe(true);
    expect(preflopHands['Q8'].all()).toBe(true);

    expect(preflopHands['AK'].allOffSuits()).toBe(true);
    expect(preflopHands['AK'].suitedOn).toBe(false);

    expect(preflopHands['KQ'].offSuitedOn).toBe(false);
    expect(preflopHands['KQ'].allSuits()).toBe(true);
  });
});
