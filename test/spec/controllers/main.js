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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });

  it('range object should have 91 combos', function() {
    expect(_.size(scope.ranges)).toBe(91); 
  });

  it('range object combos should be unique', function() {
    expect(_.uniq(_.toArray(scope.ranges)).length).toBe(91); 
  });

  it('range object should have own combos child object', function() {
    scope.ranges['T8'].combos['hc'] = false;
    expect(scope.ranges['T9'].combos['hc']).toBe(true); 
    expect(scope.ranges['T8'].combos['hc']).toBe(false); 
  });

  it('range object pair comobs have different combos subobject', function() {
    expect(_.toArray(scope.ranges['22'].combos).length).toBe(6); 
    expect(_.toArray(scope.ranges['33'].combos).length).toBe(6); 
    expect(_.toArray(scope.ranges['99'].combos).length).toBe(6); 
    expect(_.toArray(scope.ranges['TT'].combos).length).toBe(6); 
    expect(_.toArray(scope.ranges['AA'].combos).length).toBe(6); 
  });
});
