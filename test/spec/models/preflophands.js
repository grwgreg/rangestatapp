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

  
  it('should have an allOnCombos function return array of all combos with value true', function() {
    _.each(preflopHands['88'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['88'].allOnCombos().join('') == 'cdchcsdhdshs').toBe(true);

    preflopHands['88'].combos.dh = false;

    expect(preflopHands['88'].allOnCombos().join('') == 'cdchcsdshs').toBe(true);

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
    //console.log('dbg', preflopHands['T8'].offSuitedOnCombos());
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

  it('should have setAll method set all combos to true or false', function() {
    _.each(preflopHands['94'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['94'].all()).toBe(true);
    preflopHands['94'].setAll(false);
    _.each(preflopHands['94'].combos, function(val, key, obj) {
      var isOn = obj[key];
      expect(isOn).toBe(false);
    });
    expect(preflopHands['94'].suitedOn).toBe(false); 
    expect(preflopHands['94'].offSuitedOn).toBe(false); 

    preflopHands['94']['cd'] = true;
    preflopHands['94'].setAll(false);
    _.each(preflopHands['94'].combos, function(val, key, obj) {
      var isOn = obj[key];
      expect(isOn).toBe(false);
    });

    preflopHands['94'].setAll(true);
    expect(preflopHands['94'].all()).toBe(true);


  });

  it('should have set all suited method', function() {
    _.each(preflopHands['97'].combos, function(val, key, obj) {
      obj[key] = false;
    });
    preflopHands['97'].suitedOn = false;
    expect(preflopHands['97'].allSuits()).toBe(false);
    preflopHands['97'].setAllSuited(true); 
    expect(preflopHands['97'].allSuits()).toBe(true);
    expect(preflopHands['97'].suitedOn).toBe(true);
  });

  it('should have set all offsuits method', function() {
    _.each(preflopHands['T7'].combos, function(val, key, obj) {
      obj[key] = false;
    });
    preflopHands['T7'].offSuitedOn = false;
    expect(preflopHands['T7'].allOffSuits()).toBe(false);

    preflopHands['T7'].setAllOffSuited(true); 
    expect(preflopHands['T7'].allOffSuits()).toBe(true);
    expect(preflopHands['T7'].offSuitedOn).toBe(true);
  });
});
