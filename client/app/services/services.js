angular.module('myAngular.services', [])

.factory('Login', function ($http, $state, $rootScope, User) {
  return {
    attemptLogin: function(user, remember) {
      return $http({
        method: 'POST',
        url: 'api/account/logon',
        data: user
      }).then(function success(response) {
        if(response.data.success) {
          User.setUser(response.data.extras.userProfileModel);
          var user = User.getUser();
          if(remember) {
            localStorage.setItem('email', user.email);
            localStorage.setItem('firstName', user.firstName);
            localStorage.setItem('lastName', user.lastName);
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('password');
          }

          $state.go('database');
        } else {
          if(response.data.extras.msg === 0) {
            document.getElementById('login__error--password').style.visibility = 'hidden';
            document.getElementById('login__error--email').style.visibility = 'inherit';
          } else if(response.data.extras.msg === 1) {
            document.getElementById('login__error--email').style.visibility = 'hidden';
            document.getElementById('login__error--password').style.visibility = 'inherit';
          } else {
            console.log(response);
          }
        }
      }, function error(response) {
        console.log(response);
      })
    }
  };
})

.factory('Logoff', function ($http, $state, User) {
  return {
    logoff: function() {
      return $http({
        method: 'GET',
        url: 'api/account/logoff',
      }).then(function success(response) {
        User.setUser({});
        $state.go('login');
      }, function error(response) {
        console.log(response);
      })
    }
  }
})

.factory('Register', function ($http, Login) {
  return {
    attemptRegister: function(user) {
      return $http({
        method: 'POST',
        url: 'api/account/register',
        data: user
      }).then(function success(response) {
        return {
          email: user.email,
          password: user.password
        }
      }, function error(response) {
        console.log(response);
      }).then(Login.attemptLogin);
    }
  };
})

.factory('Reset', function ($http, $state) {
  return {
    resetPassword: function(email) {
      return $http({
        method: 'POST',
        url: 'api/account/resetpassword',
        data: email
      }).then(function success(response) {
        if(response.data.extras.msg === 0) {
          document.getElementById('reset__error--email').style.visibility = 'visible';
        } else {
          document.getElementById('reset__error--email').style.visibility = 'hidden';
          $state.go('resetFinal');
        }
      }, function error(response) {
        console.log(response);
      });
    }
  };
})

.factory('ResetFinal', function ($http, $state, ResetFinalError) {
  return {
    resetPassword: function(user) {
      return $http({
        method: 'POST',
        url: 'api/account/resetpasswordfinal',
        data: user
      }).then(function success(response) {
        if(!response.data.extras && response.data.success) {
          $state.go('login');
        } else {
          if(response.data.extras.msg === 6) {
            ResetFinalError.hideErrorMessages();
            document.getElementById('resetFinal__error--expired').style.visibility = "inherit";
          } else if(response.data.extras.msg === 0) {
            ResetFinalError.hideErrorMessages();
            document.getElementById('resetFinal__error--password').style.visibility = "inherit";
          } else if(response.data.extras.msg === 7) {
            ResetFinalError.hideErrorMessages();
            document.getElementById('resetFinal__error--badHash').style.visibility = "inherit";
          } else if (response.data.extras.msg === 8) {
            ResetFinalError.hideErrorMessages();
            document.getElementById('resetFinal__error--email').style.visibility = "inherit";
          };
        }
      }, function error(response) {
        console.log(response);
      });
    }
  };
})

.factory('ResetFinalError', function () {
  return {
    hideErrorMessages: function() {
      document.getElementById('resetFinal__error--empty').style.visibility = "hidden";
      document.getElementById('resetFinal__error--email').style.visibility = "hidden";
      document.getElementById('resetFinal__error--password').style.visibility = "hidden";
      document.getElementById('resetFinal__error--expired').style.visibility = "hidden";
      document.getElementById('resetFinal__error--badHash').style.visibility = "hidden";
    }
  }
})

.factory('CreateTodo', function ($http, GetTodos) {
  return {
    createTodo: function(todo) {
      return $http({
        method: 'POST',
        url: 'api/todo/create',
        data: todo
      }).then(function success(response) {
      }, function error(response) {
        console.log('error: ', response);
      });
    }
  }
})

.factory('GetTodos', function ($http) {
  return {
    getTodos: function(user) {
      return $http({
        method: 'POST',
        url: 'api/todo/get',
        data: user
      }).then(function success(response) {
        return response.data;
      }, function error(response) {
        return response.data;
      })
    }
  }
})

.factory('DeleteTodos', function ($http) {
  return {
    deleteTodos: function(id) {
      return $http({
        method: 'DELETE',
        url: 'api/todo/delete/' + id
      }).then(function success(response) {
        return response;
      }, function error(response) {
        return response;
      })
    }
  }
})

.factory('UpdateTodo', function ($http) {
  return {
    updateTodo: function(id) {
      return $http({
        method: 'PUT',
        url: 'api/todo/edit/' + id
      }).then(function success(response) {
        return response;
      }, function error(response) {
        return response;
      })
    }
  }
})

.factory('User', function() {
  var user = {};
  return {
    setUser: function(profile){
      user = profile;
      sessionStorage["user"] = JSON.stringify(user);
    },
    getUser: function() {
      this.init();
      return user;
    },
    init: function() {
      if(sessionStorage["user"] !== undefined) {
        var data = JSON.parse(sessionStorage["user"]);
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
      }
    }
  }
});
