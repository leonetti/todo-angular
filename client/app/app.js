angular.module('myAngular', [
  'myAngular.services',
  'myAngular.login',
  'myAngular.register',
  'myAngular.database',
  'myAngular.main',
  'myAngular.reset',
  'myAngular.resetFinal',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'loginController',
      data: {
        requireLogin: false
      }
    })

    .state('register', {
      url: '/register',
      templateUrl: 'app/register/register.html',
      controller: 'registerController',
      data: {
        requireLogin: false
      }
    })

    .state('reset', {
      url: '/reset',
      templateUrl: 'app/reset/reset.html',
      controller: 'resetController',
      data: {
        requireLogin: false
      }
    })

    .state('resetFinal', {
      url: '/resetFinal',
      templateUrl: 'app/resetFinal/resetFinal.html',
      controller: 'resetFinalController',
      data: {
        requireLogin: false
      }
    })

    .state('database', {
      url: '/database',
      templateUrl: 'app/database/database.html',
      controller: 'databaseController',
      data: {
        requireLogin: true
      }
    })
  $urlRouterProvider.otherwise('/login');
})

.run(function ($rootScope, $location, $state, User) {
  $rootScope.$on('$stateChangeStart',
  function(event, toState, toParams, fromState, fromParams){
    if(toState.data.requireLogin === true) {
      var user = sessionStorage["user"] === undefined ? {} : User.getUser();
      if(!user.email || !user.firstName || !user.lastName) {
        console.log('not authorized');
        event.preventDefault();
        $state.go('login');
      }
    }
  });


});
