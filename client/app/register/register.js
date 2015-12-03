angular.module('myAngular.register', [])

.controller('registerController', function($scope, Register) {
  console.log('Initialized Register Controller');
  $scope.user = {};

  sessionStorage.clear();

  $scope.register = function() {
    if($scope.user.email && $scope.user.firstName && $scope.user.lastName && $scope.user.password && $scope.user.passwordConfirm) {
      document.getElementById('register__error--empty').style.visibility = 'hidden';
      if($scope.user.password === $scope.user.passwordConfirm) {
        Register.attemptRegister($scope.user);
      } else {
        document.getElementById('register__error--password').style.visibility = 'inherit';
      }
    } else {
      document.getElementById('register__error--password').style.visibility = 'hidden';
      document.getElementById('register__error--empty').style.visibility = 'inherit';
    }
  };
});
