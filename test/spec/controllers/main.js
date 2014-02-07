'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('rangeStatApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a range object with 91 hand combos', function() {
    expect(_.size(scope.ranges)).toBe(91); 
  });

});

describe('Factory: preflopHands', function () {

  // load the controller's module
  beforeEach(module('rangeStatApp'));

  var preflopHands;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_preflopHands_) {
    preflopHands = _preflopHands_; 
  }))
 
  it('should have 91 combos', function() {
    expect(_.size(preflopHands)).toBe(91); 
  });

  it('should have unique hand keys', function() {
    expect(_.uniq(_.toArray(preflopHands)).length).toBe(91); 
  });

  it('should have own combos child object', function() {
    preflopHands['T8'].combos['hc'] = false;
    expect(preflopHands['T9'].combos['hc']).toBe(true); 
    expect(preflopHands['T8'].combos['hc']).toBe(false); 
  });

  it('should have pair combos with different combos subobject', function() {
    expect(_.toArray(preflopHands['22'].combos).length).toBe(6); 
    expect(_.toArray(preflopHands['33'].combos).length).toBe(6); 
    expect(_.toArray(preflopHands['99'].combos).length).toBe(6); 
    expect(_.toArray(preflopHands['TT'].combos).length).toBe(6); 
    expect(_.toArray(preflopHands['AA'].combos).length).toBe(6); 
  });

  it('should have all function return true if all combos have value true', function() {
    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['T8'].all()).toBe(true);

    preflopHands['T8'].combos.cd = false;
    expect(preflopHands['T8'].all()).toBe(false);
  });

  it('should have an all suits function return true if all suited combos have value true', function() {
    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['T8'].allSuits()).toBe(true);

    preflopHands['T8'].combos.cc = false;
    expect(preflopHands['T8'].allSuits()).toBe(false);
    expect(preflopHands['44'].allSuits()).toBe(false);
  });

  it('should have a suitedOnCombos function return array of suited combos with value true', function() {
    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['T8'].suitedOnCombos().join('') == 'ccddhhss').toBe(true);

    preflopHands['T8'].combos.dd = false;

    expect(preflopHands['T8'].suitedOnCombos().join('') == 'cchhss').toBe(true);

    preflopHands['T8'].combos.cc = false;
    preflopHands['T8'].combos.ss = false;
    preflopHands['T8'].combos.hh = false;

    expect(preflopHands['T8'].suitedOnCombos().join('') == '').toBe(true);

    preflopHands['T8'].combos.ss = true;
    expect(preflopHands['T8'].suitedOnCombos().join('') == 'ss').toBe(true);
  });

  it('should have an offSuitedOnCombos function return array of off suited combos with value true', function() {
    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    console.log('dbg', preflopHands['T8'].offSuitedOnCombos());
    expect(preflopHands['T8'].offSuitedOnCombos().join('') == 'cdchcsdcdhdshchdhsscsdsh').toBe(true);

    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = false;
    });

    preflopHands['T8'].combos.hd = true;
    preflopHands['T8'].combos.hc = true;
    preflopHands['T8'].combos.sd = true;
    preflopHands['T8'].combos.cd = true;
    expect(preflopHands['T8'].offSuitedOnCombos().join('') == 'cdhchdsd').toBe(true);
  });
  /* disabled but reuse this for toggling all suited
  it('should have toggle suited method', function() {
    _.each(preflopHands['97'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['97'].suited()).toBe(true);
    preflopHands['97'].toggleSuited(); 
    expect(preflopHands['97'].suited()).toBe(false);
    preflopHands['97'].toggleSuited(); 
    expect(preflopHands['97'].suited()).toBe(true);
  });
  */

  it('should have offsuits helper method return offsuited combos', function() {
     expect(_.size(preflopHands['QJ'].offSuits())).toBe(12); 
  });

  it('should have all offsuits method return true if all offsuit combos are true', function() {
    _.each(preflopHands['94'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['94'].allOffSuits()).toBe(true);

    _.each(preflopHands['94'].combos, function(val, key, obj) {
      obj[key] = false;
    });
    expect(preflopHands['94'].allOffSuits()).toBe(false);

    _.each(preflopHands['94'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    preflopHands['94'].cc = false;
    expect(preflopHands['94'].allOffSuits()).toBe(true);

  });
  /*
  it('should have toggle offsuits method', function() {
    _.each(preflopHands['T7'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['T7'].offSuited()).toBe(true);

    preflopHands['T7'].toggleOffSuited(); 
    expect(preflopHands['T7'].offSuited()).toBe(false);
    expect(preflopHands['T7'].combos.hs).toBe(false);
    expect(preflopHands['T7'].combos.cd).toBe(false);

    preflopHands['T7'].toggleOffSuited(); 
    expect(preflopHands['T7'].offSuited()).toBe(true);
  });
  */
});

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
//    console.log('result', rangeFormatter.groupHands(aceX, 's'));
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
//    console.log('result', rangeFormatter.groupHands(aceX, 's'));
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
    //console.log('result', rangeFormatter.groupHands(kingX, 'o'));
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
    console.log('result', rangeFormatter.groupHands(kingX, 'o'));
  });
});
