var express = require('express');
var router = express.Router();
var AccountController = require('../controllers/account.js');
var UserRegistration = require('../models/user-registration.js');
var UserLogon = require('../models/user-logon.js');
var User = require('../models/user.js');
var ApiResponse = require('../models/api-response.js');
var UserPasswordReset = require('../models/user-pwd-reset.js');
var UserPasswordResetFinal = require('../models/user-pwd-reset-final.js');
var session = [];
var MailerMock = require('../test/mailer-mock.js');
var mailer = new MailerMock();
var Todo = require('../models/todo.js');


router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/account/register')
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userRegistration = new UserRegistration(req.body);
  var apiResponseStep1 = accountController.getUserFromUserRegistration(userRegistration);

  if(apiResponseStep1.success) {
    accountController.register(apiResponseStep1.extras.user, function(err, apiResponseStep2) {
      return res.send(apiResponseStep2);
    });
  } else {
    res.send(apiResponseStep1);
  }
});

router.route('/account/logon')
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userLogon = new UserLogon(req.body);

  accountController.logon(userLogon.email, userLogon.password, function(err, response) {
    if(err)
      return err;
    return res.send(response);
  });
});

router.route('/account/logoff')
.get(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  accountController.logoff();
  res.send(new ApiResponse({
    success: true
  }));
});

router.route('/account/resetpassword')
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userPasswordReset = new UserPasswordReset(req.body);
  accountController.resetPassword(userPasswordReset.email, function(err, response) {
    if(err)
        return err;
    return res.send(response);
  });
});

router.route('/account/resetpasswordfinal')
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userPasswordResetFinal = new UserPasswordResetFinal(req.body);
  accountController.resetPasswordFinal(userPasswordResetFinal.email, userPasswordResetFinal.newPasswordConfirm, userPasswordResetFinal.passwordResetHash, function(err, response) {
    if(err)
      return err;
    return res.send(response);
  });
});

router.route('/todo/create')
.post(function(req, res) {
  new Todo({
    email: req.body.email,
    content: req.body.content,
    day: req.body.day,
    updated_at: Date.now()
  }).save(function(err, todo, count) {
    res.send(todo);
  })
});

router.route('/todo/get')
.post(function(req, res) {
  console.log(req.body.email);
  Todo.find({ 'email': req.body.email }, function(err, todos) {
    if(err) {
      return console.log(err);
    }
    res.send(todos);
  })
});

router.route('/todo/delete/:id')
.delete(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if(todo) {
      todo.remove(function(err, todo) {
        res.send('worked');
      })
    } else {
      res.send('error');
    }
  })
});

// router.route('/todo/edit/:id')
// .put(function(req, res) {
//   Todo.findById(req.params.id, function(err, todo) {

//   })
// })

module.exports = router;

