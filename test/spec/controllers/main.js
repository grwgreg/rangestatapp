'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('flopzillaApp'));

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
  beforeEach(module('flopzillaApp'));

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

  it('should have a suited function return true if all suited combos have value true', function() {
    _.each(preflopHands['T8'].combos, function(val, key, obj) {
      obj[key] = true;
    });
    expect(preflopHands['T8'].suited()).toBe(true);

    preflopHands['T8'].combos.cc = false;
    expect(preflopHands['T8'].suited()).toBe(false);
    expect(preflopHands['44'].suited()).toBe(false);
  });

});
