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
    expect(_.size(scope.main.preflopHands)).toBe(91); 
  });

});
