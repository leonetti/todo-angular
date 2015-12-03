angular.module('myAngular.resetFinal', [])

.controller('resetFinalController', function($scope, ResetFinal, ResetFinalError) {
  console.log('Initialized Reset Final Controller');

  $scope.user = {};

  $scope.resetFinal = function() {
    if(!$scope.user.email || !$scope.user.passwordResetHash || !$scope.user.newPassword || !$scope.user.newPasswordConfirm) {
      ResetFinalError.hideErrorMessages();
      document.getElementById('resetFinal__error--empty').style.visibility = "inherit";
    } else if ($scope.user.newPassword !== $scope.user.newPasswordConfirm) {
      ResetFinalError.hideErrorMessages();
      document.getElementById('resetFinal__error--password').style.visibility = "inherit";
    } else {
      ResetFinalError.hideErrorMessages();
      ResetFinal.resetPassword($scope.user);
    }
  };
});
