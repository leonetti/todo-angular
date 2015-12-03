angular.module('myAngular.database', [])

.controller('databaseController', function($scope, CreateTodo, User, GetTodos, DeleteTodos, $state) {
  console.log('Initialized Database Controller');
  $scope.days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  $scope.selected = 'MONDAY';
  $scope.todos = [];
  var user = User.getUser();
  var deleteTodos = [];

  $scope.showTodo = function(day) {
    deleteChecked();
    document.getElementById('database__' + $scope.selected).style['border-right'] = '1px solid rgba(255, 255, 255, 0.3)';
    document.getElementById('database__' + $scope.selected).style['background-color'] = 'rgba(255, 255, 255, 0.6)';
    $scope.selected = day;
    document.getElementById('database__' + $scope.selected).style['border-right'] = 'none';
    document.getElementById('database__' + $scope.selected).style['background-color'] = 'rgba(255, 255, 255, 0.8)';
    document.getElementById('database__input').focus();
    deleteTodos = [];
    checkDeleteButton();
  };

  $scope.todoSubmit = function() {
    if(!$scope.todo) {
      alert('enter a todo');
      document.getElementById('database__input').focus();
    } else {
      deleteTodos = [];
      deleteChecked();
      checkDeleteButton();
      var todo = {};
      todo.email = user.email;
      todo.content = $scope.todo;
      todo.day = $scope.selected;
      if(todo.email && todo.content && todo.day) {
        CreateTodo.createTodo(todo);
        $scope.todo = "";
      }
      getTodos();
    }
  }

  $scope.checkDelete = function(id) {
    var todoIndex = deleteTodos.indexOf(id);
    if(todoIndex !== -1) {
      deleteTodos.splice(todoIndex, 1);
    } else {
      deleteTodos.push(id);
    }
    checkDeleteButton();
  }

  $scope.todoDelete = function() {
    while(deleteTodos.length > 0) {
      if(deleteTodos.length === 1) {
        DeleteTodos.deleteTodos(deleteTodos[0]).then(function(response){
          console.log(response);
          getTodos();
          checkDeleteButton();
          document.getElementById('database__input').focus();
        })
      } else {
        DeleteTodos.deleteTodos(deleteTodos[0]);
      }
      deleteTodos.splice(0, 1);
    }
  }

  var deleteChecked = function() {
    for(var i=0; i<deleteTodos.length; i++) {
      for(var j=0; j<$scope.todos.length; j++) {
        if(deleteTodos[i] === $scope.todos[j]._id) {
          $scope.todos[j].isSelected = false;
          continue;
        }
      }
    }
  }

  var checkDeleteButton = function() {
    if(deleteTodos.length === 1 && deleteTodos.length > 0) {
      document.getElementById('database__input').style['width'] = 'calc(100% - 240px)';
      document.getElementById('database__input').style['margin-left'] = '0';
      document.getElementById('database__delete').style['display'] = 'inherit';
    } else if(deleteTodos.length === 0 || !deleteTodos.length) {
      document.getElementById('database__delete').style['display'] = 'none';
      document.getElementById('database__input').style['width'] = 'calc(100% - 140px)';
      document.getElementById('database__input').style['margin-left'] = '20px';
    }
  }

  var getTodos = function() {
    console.log('getTodos2');
    return GetTodos.getTodos(user).then(function(todos) {
      $scope.todos = todos;
    });
  }

  getTodos();
});
