var express = require('express'),
    router = express.Router(),
    AccountController = require('../controllers/account.js'),
    UserRegistration = require('../models/user-registration.js'),
    UserLogon = require('../models/user-logon.js'),
    User = require('../models/user.js'),
    ApiResponse = require('../models/api-response.js'),
    UserPasswordReset = require('../models/user-pwd-reset.js'),
    UserPasswordResetFinal = require('../models/user-pwd-reset-final.js'),
    session = [],
    MailerMock = require('../test/mailer-mock.js'),
    mailer = new MailerMock();

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

router.route('/account/logon') // .get with body bad practice? (originally a .get changed to .post)
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userLogon = new UserLogon(req.body);

  accountController.logon(userLogon.email, userLogon.password, function(err, response) {
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
    return res.send(response);
  });
});

router.route('/account/resetpasswordfinal')
.post(function(req, res) {
  var accountController = new AccountController(User, req.session, mailer);
  var userPasswordResetFinal = new UserPasswordResetFinal(req.body);
  accountController.resetPasswordFinal(userPasswordResetFinal.email, userPasswordResetFinal.newPasswordConfirm, userPasswordResetFinal.passwordResetHash, function(err, response) {
    return res.send(response);
  });
});

module.exports = router;

