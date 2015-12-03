angular.module('myAngular.login', [])

.controller('loginController', function($scope, Login) {
  console.log('Initialized Login Controller');
  $scope.user = {};
  $scope.remember = true;

  sessionStorage.clear();

  if(localStorage.email) {
    $scope.user.email = localStorage.email;
    $scope.user.password = localStorage.password;
  }

  $scope.login = function() {
    if($scope.user.email && $scope.user.password) {
      document.getElementById('login__error--empty').style.visibility = 'hidden';
      document.getElementById('login__error--email').style.visibility = 'hidden';
      document.getElementById('login__error--password').style.visibility = 'hidden';
      localStorage.setItem('password', $scope.user.password);
      Login.attemptLogin($scope.user, $scope.remember);
    } else {
      document.getElementById('login__error--email').style.visibility = 'hidden';
      document.getElementById('login__error--password').style.visibility = 'hidden';
      document.getElementById('login__error--empty').style.visibility = 'inherit';
    }
  };
});
