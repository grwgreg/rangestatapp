describe('Factory: rangeFormatter', function () {

  // load the controller's module
  beforeEach(module('rangeStatApp'));

  var rangeFormatter,
    preflopHands;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_rangeFormatter_, _preflopHands_) {
    preflopHands = _preflopHands_;
    rangeFormatter = new _rangeFormatter_(preflopHands); 
  }))
 
  it('should have comboFind function return on combos based on type param', function() {
    preflopHands['AK'].combos.cd = false;
    preflopHands['AK'].combos.dd = false;
    expect(rangeFormatter.comboFind('AK', 'o').length == 11).toBe(true);
    expect(rangeFormatter.comboFind('AK', 's').length == 3).toBe(true);
  });
  
  it('should have group hands method return nested arrays of sequential on suited cards', function() {
    var testhands1 = ['AK', 'AJ', 'A9', 'A8', 'A7', 'A4'],
      tags = '23456789TJQKA',
      aceX = _.map(_.range(0, 12), function(el) {
        return 'A' + tags[el]; 
      }).reverse();
    _.each(testhands1, function(hand) {
      preflopHands[hand].suitedOn = true; 
    }, this); 
    var groups = rangeFormatter.groupHands(aceX, 's');
    expect(_.isEqual(groups, [['AK'], ['AJ'], ['A9', 'A8', 'A7'], ['A4']])).toBe(true);
  });

  it('group hands method return empty array if no on cards', function() {
    var tags = '23456789TJQKA',
      aceX = _.map(_.range(0, 12), function(el) {
        return 'A' + tags[el]; 
      }).reverse();
    var groups = rangeFormatter.groupHands(aceX, 's');
    expect(_.isEmpty(groups) && _.isArray(groups)).toBe(true);
  });

  it('should have group suited hands that arent all on as single group', function() {
    var testhands1 = ['AK', 'AJ', 'A9', 'A8', 'A7', 'A4'],
      tags = '23456789TJQKA',
      aceX = _.map(_.range(0, 12), function(el) {
        return 'A' + tags[el]; 
      }).reverse();
    _.each(testhands1, function(hand) {
      preflopHands[hand].suitedOn = true; 
    }, this); 
    preflopHands['A8'].combos.dd = false;
    var groups = rangeFormatter.groupHands(aceX, 's');
    expect(_.isEqual(groups, [['AK'], ['AJ'], ['A9'], ['A8cc', 'A8hh', 'A8ss'], ['A7'], ['A4']])).toBe(true);
  });

  it('should have group hands method return nested arrays of sequential on offsuited cards', function() {
    var testhands1 = ['KJ', 'K9', 'K8', 'K7', 'K4', 'K3','K2'],
      tags = '23456789TJQ',
      kingX = _.map(_.range(0, 10), function(el) {
        return 'K' + tags[el]; 
      }).reverse();
    _.each(testhands1, function(hand) {
      preflopHands[hand].offSuitedOn = true; 
    }, this); 
    var groups = rangeFormatter.groupHands(kingX, 'o');
    expect(_.isEqual(groups, [['KJ'], ['K9', 'K8', 'K7'], ['K4', 'K3', 'K2']])).toBe(true);
  });
  it('should have group hands method return nested arrays of sequential on offsuited cards', function() {
    var testhands1 = ['KJ', 'K9', 'K8', 'K7', 'K4', 'K3','K2'],
      tags = '23456789TJQ',
      kingX = _.map(_.range(0, 10), function(el) {
        return 'K' + tags[el]; 
      }).reverse();
    _.each(testhands1, function(hand) {
      preflopHands[hand].offSuitedOn = true; 
    }, this); 
    preflopHands['KJ'].combos.hc = false;
    preflopHands['K8'].combos.dc = false;
    preflopHands['K2'].combos.sc = false;
    var groups = rangeFormatter.groupHands(kingX, 'o');
    expect(_.isEqual(groups[0], ['KJcd', 'KJch', 'KJcs', 'KJdc', 'KJdh', 'KJds', 'KJhd', 'KJhs', 'KJsc', 'KJsd', 'KJsh'])).toBe(true);
    expect(_.isEqual(groups.length, 6)).toBe(true);
  });

  it('should have group hands method return sequential pairs', function() {
    var tags = '23456789TJQKA'.split('').reverse(),
      pairs = _.map(tags, function(tag) {
        return tag + tag; 
      });

    _.each(pairs, function(hand) {
      preflopHands[hand].pairOn = true; 
    }, this); 

    var offTags = ['22', '44', '55', '66', '99', 'AA'];
    _.each(offTags, function(tag) {
      preflopHands[tag].pairOn = false; 
    }, this); 

    var groups = rangeFormatter.groupHands(pairs, 'p');
    expect(_.isEqual(groups, [['KK', 'QQ', 'JJ', 'TT'], ['88', '77'], ['33']])).toBe(true);
  });
  
  
  it('should have group hands method return sequential pairs and group individually if not all combos for hand', function() {
    var tags = '23456789TJQKA'.split('').reverse(),
      pairs = _.map(tags, function(tag) {
        return tag + tag; 
      });

    _.each(pairs, function(hand) {
      preflopHands[hand].pairOn = true; 
    }, this); 

    var offTags = ['22', '44', '55', '66', '99', 'AA'];
    _.each(offTags, function(tag) {
      preflopHands[tag].pairOn = false; 
    }, this); 
    //console.log(preflopHands['TT']);

    
    preflopHands['33'].combos.dh = false; 
    preflopHands['TT'].combos.dh = false; 
    preflopHands['TT'].combos.ds = false; 
    preflopHands['TT'].combos.ch = false; 
    preflopHands['KK'].combos.hs = false; 
    
    var groups = rangeFormatter.groupHands(pairs, 'p');
    //console.log('groups', groups);
    expect(_.isEqual(groups[0], ['KKcd', 'KKch', 'KKcs', 'KKdh', 'KKds'])).toBe(true);
    expect(_.isEqual(groups[4], ['33cd', '33ch', '33cs', '33ds', '33hs'])).toBe(true);
 
  });
  
  it('should have inBothGroups return array of groups in both suited and offsuited', function() {
    var offSuitedGroup =  [['KJ'], ['K9', 'K8', 'K7'], ['K4', 'K3', 'K2']],
      suitedGroup =  [['AK'], ['KJ'], ['K9', 'K8'], ['K4', 'K3', 'K2']],
      inBothGroups = rangeFormatter.inBothGroups(offSuitedGroup, suitedGroup);
    expect(_.isEqual(inBothGroups, [['KJ'], ['K4', 'K3', 'K2']])).toBe(true);


  });

  it('should have listToString method turn array of hands into range string', function() {
    var group =  [['KJ'], ['K9', 'K8', 'K7'], ['K4', 'K3', 'K2']],
      rangeStrings = '';

    _.each(group, function(list) {
      rangeStrings += rangeFormatter.listToString(list, 's') + ' ';
    });
    expect(_.isEqual(rangeStrings, 'KJs K9-7s K4-2s ')).toBe(true);
    
    rangeStrings = '';
    _.each(group, function(list) {
      rangeStrings += rangeFormatter.listToString(list, 'o') + ' ';
    });
    expect(_.isEqual(rangeStrings, 'KJo K9-7o K4-2o ')).toBe(true);

    rangeStrings = '';
    _.each(group, function(list) {
      rangeStrings += rangeFormatter.listToString(list) + ' ';
    });
    expect(_.isEqual(rangeStrings, 'KJ K9-7 K4-2 ')).toBe(true);

    rangeStrings = rangeFormatter.listToString(['A8cc', 'A8hh', 'A8ss'], 's');
    expect(_.isEqual(rangeStrings, 'A8cc, A8hh, A8ss')).toBe(true);
  });

  it('should have rangeToString method return groups for matrix columns by type', function() {
    preflopHands['JJ'].pairOn = true;
    preflopHands['88'].pairOn = true;
    preflopHands['77'].pairOn = true;
    preflopHands['66'].pairOn = true;
    preflopHands['KJ'].offSuitedOn = true;
    preflopHands['KT'].offSuitedOn = true;
    preflopHands['K9'].offSuitedOn = true;
    preflopHands['QJ'].offSuitedOn = true;
    preflopHands['JT'].offSuitedOn = true;
    preflopHands['JT'].suitedOn = true;
    preflopHands['J9'].offSuitedOn = true;
    preflopHands['J9'].suitedOn = true;
    preflopHands['J8'].offSuitedOn = true;
    preflopHands['J8'].suitedOn = true;

    preflopHands['J9'].combos.cd = false;
    preflopHands['J9'].combos.dc = false;
    preflopHands['J9'].combos.ch = false;
    preflopHands['J9'].combos.hc = false;
    preflopHands['J9'].combos.cs = false;
    preflopHands['J9'].combos.sh = false;

    preflopHands['98'].suitedOn = true;
    preflopHands['97'].suitedOn = true;
    preflopHands['98'].offSuitedOn = true;
    preflopHands['97'].offSuitedOn = true;

    preflopHands['76'].suitedOn = true;
    preflopHands['75'].suitedOn = true;
    preflopHands['75'].offSuitedOn = true;
    preflopHands['74'].suitedOn = true;
    preflopHands['73'].suitedOn = true;
    preflopHands['72'].suitedOn = true;

    preflopHands['73'].combos.dd = false;

    preflopHands['54'].offSuitedOn = true;
    preflopHands['53'].offSuitedOn = true;
    preflopHands['52'].offSuitedOn = true;

    var rangeString = rangeFormatter.rangeToString();
    expect(_.isEqual(rangeString, 'JJ, 88-66, KJ-9o, QJo, JTo, J9dh, J9ds, J9hd, J9hs, J9sc, J9sd, J8o, JT-8s, 98-7, 75o, 76-4s, 73cc, 73hh, 73ss, 72s, 54-2o')).toBe(true);
  });
});
