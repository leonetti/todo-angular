angular.module('myAngular.main', [])

.controller('mainController', function($scope, $rootScope, Logoff) {
  console.log('Initialized Main Controller');

  $scope.logoff = function() {
    Logoff.logoff();
  };

});
