var AccountController = require('../controllers/account.js'),
    mongoose = require('mongoose'),
    should = require('should'),
    uuid = require('node-uuid'),
    crypto = require('crypto'),
    User = require('../models/user.js'),
    UserMock = require('./user-mock.js'),
    MailerMock = require('./mailer-mock.js'),
    ApiMessages = require('../models/api-messages.js');

describe('AccountController', function() {
  var controller,
      seedUsersCount = 10,
      testUser,
      userModelMock,
      session = {},
      mailMock;

  beforeEach(function(done) {
    userModelMock = new UserMock();
    mailerMock = new MailerMock();
    controller = new AccountController(userModelMock, session, mailerMock);
    done();
  });

  afterEach(function(done) {
    userModelMock.setError(false);
    done();
  });

  // Testing the logon method
  describe('#logon', function() {
    // When there is a database error
    it('Returns database error', function(done) {
      userModelMock.setError(true);
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser(),
          testUserPassword = 'Password0';

      controller.logon(testUser.email, testUserPassword, function(err, apiResponse) {
        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.DB_ERROR);
        done();
      });
    });

    // Correctly creates a user - hashes password and checks
    it('Creates user session', function(done) {
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser(),
          testUserPassword = 'Password0';

      controller.logon(testUser.email, testUserPassword, function(err, apiResponse) {
        if(err)
          return done(err);
        should(apiResponse.success).equal(true);
        should.exist(apiResponse.extras.userProfileModel);
        should.exist(controller.getSession().userProfileModel);
        should(apiResponse.extras.userProfileModel).equal(controller.getSession().userProfileModel);
        done();
      });
    });

    // Tests for non existant email
    it('Returns "Email not found"', function(done) {
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser(),
          testUserPassword = 'Password0',
          nonExistentEmailAddress = 'test';

      controller.logon(nonExistentEmailAddress, testUserPassword, function(err, apiResponse) {
        if(err)
          return done(err);
        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.EMAIL_NOT_FOUND);
        done();
      });
    });

    // Tests for invalid password
    it('Returns "Invalid password"', function(done) {
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser(),
          invalidPassword = 'Password';

      controller.logon(testUser.email, invalidPassword, function(err, apiResponse) {
        if(err)
          return done(err);
        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.INVALID_PWD);
        done();
      })
    })
  });

  describe('#logoff', function() {
    it('Destroys user session', function(done) {
      controller.logoff();
      should.not.exist(controller.getSession().userProfileModel);
      done();
    })
  });

  describe('#register', function() {
    it('Returns db error', function(done) {
      userModelMock.setError(true);
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser();

      controller.register(testUser, function(err, apiResponse) {
        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.DB_ERROR);
        done();
      });
    });

    it('Returns "Email already exists"', function(done) {
      userModelMock.seedUsers();
      var testUser = userModelMock.getTestUser();

      controller.register(testUser, function(err, apiResponse) {
        if(err)
          return done(err);

        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.EMAIL_ALREADY_EXISTS);
        done();
      });
    });

    it('Returns "Could not create user"', function(done) {
      var testUser = new UserMock();
      testUser.setNumberAffected(0);

      controller.register(testUser, function(err, apiResponse) {
        if(err)
          return done(err);

        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.COULD_NOT_CREATE_USER);
        done();
      });
    });

    it('Registers a user', function(done) {
      var testUser = new UserMock();
      testUser.setNumberAffected(1);

      controller.register(testUser, function(err, apiResponse) {
        if(err)
          return done(err);

        should(apiResponse.success).equal(true);
        done();
      });
    });
  });

  describe('#resetPassword', function() {
    it('Returns database error')
  })

});
