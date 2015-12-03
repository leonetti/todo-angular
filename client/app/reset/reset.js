angular.module('myAngular.reset', [])

.controller('resetController', function($scope, Reset) {
  console.log('Initialized Reset Controller');

  $scope.user = {};

  $scope.reset = function() {
    if($scope.user.email) {
      document.getElementById('reset__error--empty').style.visibility = 'hidden';
      Reset.resetPassword($scope.user);
    } else {
      document.getElementById('reset__error--email').style.visibility = 'hidden';
      document.getElementById('reset__error--empty').style.visibility = 'inherit';
    }
  }
})
