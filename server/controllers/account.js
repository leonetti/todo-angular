// UserModel argument is an instance of the User Mongoose Class
// This is an object that can save and retrieve user data from the DB

// Session is an object the Controller will use to store session data

// Mailer is a helper object that the Controller will use to send the password
  // reset email to the user

// Use depenency injection by passing the Controller the entities it needs
// Makes it easy to test the Controller using mock objects, without having to
  // instance the database, session, and mailer objects used in production

// Crypto and Uuid will be used to generate password hashes and unique
  // identifiers needed when registering and logging on users

// ApiResponse, ApiMessages, and UserProfile internal variables refer the model
  // Classes with the same names created
var AccountController = function(userModel, session, mailer) {
  this.crypto = require('crypto');
  this.uuid = require('node-uuid');
  this.ApiResponse = require('../models/api-response.js');
  this.ApiMessages = require('../models/api-messages.js');
  this.UserProfileModel = require('../models/user-profile.js');
  this.userModel = userModel;
  this.session = session;
  this.mailer = mailer;
  this.User = require('../models/user.js');
};

// Creating the setter and getter methods for the session
AccountController.prototype.getSession = function() {
  return this.session;
};

AccountController.prototype.setSession = function(session) {
  this.session = session;
};

// Call crypto.pbkdf2 which uses pseudorandom function to derive a key of the
  // given length from the given pass, salt, and iterations
// Will save the hash in the database instead of the password (text or encoded)
AccountController.prototype.hashPassword = function(password, salt, callback) {
  // Use pbkdf2 to hash and iterate 10k times by default
  var iterations = 10000,
      keyLen = 64; //64 bit
      this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};

// Logon a user
AccountController.prototype.logon = function(email, password, callback) {
  // Holds reference to the AccountController instance used inside
  // callback functions that are created inline
  var me = this;

  // Call findOne method of the userModel instance to try to find a user with
  // the same email in the MongoDB database.
  // The method is provided by Mongoose.
  // UserModel is an instance of the User Model created with Mongoose
  me.userModel.findOne({
    email: email
  }, function(err, user) {
    // If it produces an error, immediately invoke the callback argument passing
    // an ApiResponse where the success property is false and the contained msg
    if(err) {
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.DB_ERROR
        }
      }));
    }
    // If a user is produced, proceed to hash the password provided by the user
    if(user) {
      me.hashPassword(password, user.passwordSalt, function(err, passwordHash) {
        // Compare the hash to the password hash of the user in the database
        if(passwordHash == user.passwordHash) {
          // Creates a UserProfile instance
          var userProfileModel = new me.UserProfileModel({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          });
          // Saves the instance to the Controller's session variable
          me.session.userProfileModel = userProfileModel;
          // Invokes callback function, setting response's success property true
          // and passes in the UserProfile instance
          return callback(err, new me.ApiResponse({
            success: true,
            extras: {
              userProfileModel: userProfileModel
            }
          }));
        } else {
          // When the hashes don't match invoke callback function setting the
          // response's success property to false and passing an invalid pwd msg
          return callback(err, new me.ApiResponse({
            success: false,
            extras: {
              msg: me.ApiMessages.INVALID_PWD
            }
          }));
        }
      });
    } else {
      // If user is not produced, invoke callback funtion with response where
      // extras property contains message indicating the email was not found
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.EMAIL_NOT_FOUND
        }
      }));
    }
  });
};

// Terminates a user's session
AccountController.prototype.logoff = function() {
  // Destroy the UserProfile instance saved in the Controller's session var
  if(this.session.userProfileModel) {
    delete this.session.userProfileModel;
    return;
  }
};

// Register a user
AccountController.prototype.register = function(newUser, callback) {
  var me = this;

  // Check if a user exists with the same email address
  me.userModel.findOne({
    email: newUser.email
  }, function(err, user) {
    // If error invoke callback function and send out ApiResponse instance
    // explaining the database error
    if(err) {
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.DB_ERROR
        }
      }));
    }
    // If a user is found with the same email address, stop the registration
    if(user) {
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.EMAIL_ALREADY_EXISTS
        }
      }));
    } else {
      // If email address isn't found in the database, invoke the save
        // method (inherited from Mongoose) of the User Class
      newUser.save(function(err, user, numberAffected) {
        if(err) {
          return callback(err, new me.ApiResponse({
            success: false,
            extras: {
              msg: me.ApiMessages.DB_ERROR
            }
          }));
        }
        // Check numberAffected to make sure that the new user was saved
        // If it is 1, create a UserProfile instance and send it out embedded
          // in an ApiResponse Object
        if(numberAffected === 1) {
          var userProfileModel = new me.UserProfileModel({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          });
          return callback(err, new me.ApiResponse({
            success: true,
            extras: {
              userProfileModel: userProfileModel
            }
          }));
        } else {
          // If the number is not 1, produce an ApiResponse for failure
          return callback(err, new me.ApiResponse({
            success: false,
            extras: {
              msg: me.ApiMessages.COULD_NOT_CREATE_USER
            }
          }));
        }
      });
    }
  });
};

// Reset user's password, user must provide their email address
AccountController.prototype.resetPassword = function(email, callback) {
  var me = this;

  // Use email address to retrieve user's record from the database
  me.userModel.findOne({
    email: email
  }, function(err, user) {
    if(err) {
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.DB_ERROR
        }
      }));
    }
    if(user) {
      // Save the user's email and password reset hash in session
      // If user exists, create a unique identifier called PasswordResetHash
      var passwordResetHash = me.uuid.v4();
      me.session.passwordResetHash = passwordResetHash;
      me.session.emailWhoRequestedPasswordReset = email;

      // Pass this identifier and the user's email address to the mailer objects
        // sendPasswordResetHash method
      // This method sends a message to the user, container the uuid and password
        // reset link they can use to change their password
      me.mailer.sendPasswordResetHash(email, passwordResetHash);

      // Save the password reset hash and the user's email in the Controller's
        // session variable to later compare them
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          passwordResetHash: passwordResetHash
        }
      }));
    } else {
      return callback(err, new me.ApiResponse({
        success: false,
        extras: {
          msg: me.ApiMessages.EMAIL_NOT_FOUND
        }
      }));
    }
  });
};

// To reset password user needs to provide their email address and a new
  // along with the password reset hash we sent them in the password reset email
AccountController.prototype.resetPasswordFinal = function(email, newPassword, passwordResetHash, callback) {
  var me = this;

  // First check the password reset hash is also saved in the Controller's
    // session variable
  // Want to limit the period of time during which a user can reset their pass
  if(!me.session || !me.session.passwordResetHash) {
    return callback(null, new me.ApiResponse({
      success: false,
      extras: {
        msg: me.ApiMessages.PASSWORD_RESET_EXPIRED
      }
    }));
  }

  // If password reset hash value stored in session and value supplied by user
    // don't match
  if(me.session.passwordResetHash !== passwordResetHash) {
    return callback(null, new me.ApiResponse({
      success: false,
      extras: {
        msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH
      }
    }));
  }
  // If email value stored in session and value supplied by user don't match
  if(me.session.emailWhoRequestedPasswordReset !== email) {
    return callback(null, new me.ApiResponse({
      success: false,
      extras: {
        msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH
      }
    }));
  }

  // If password reset hash and email validations are successful, hash the new
    // password and save it by calling the User model's update method (Mongoose)
  var passwordSalt = this.uuid.v4();

  // Update method returns the number of records affected by update operation
  me.hashPassword(newPassword, passwordSalt, function(err, passwordHash) {
    me.userModel.update({
      email:email
    }, {
      passwordHash: passwordHash,
      passwordSalt: passwordSalt
    }, function(err, numberAffected, raw) {
      if(err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.DB_ERROR
          }
        }));
      }
      if(numberAffected < 1) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD
          }
        }));
      } else {
        return callback(err, new me.ApiResponse({
          success: true,
          extras: null
        }));
      }
    });
  });
};

AccountController.prototype.getUserFromUserRegistration = function(userRegistrationModel) {
    var me = this;

    // console.log('userPassword -------->', userRegistrationModel.password);
    // console.log('userPassword Conf --->', userRegistrationModel.passwordConfirm);

    if (userRegistrationModel.password !== userRegistrationModel.passwordConfirm) {
        return new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_CONFIRM_MISMATCH } });
    }

    var passwordSaltIn = this.uuid.v4(),
            cryptoIterations = 10000, // Must match iterations used in controller#hashPassword.
            cryptoKeyLen = 64,       // Must match keyLen used in controller#hashPassword.
            passwordHashIn;

    var user = new this.User({
        email: userRegistrationModel.email,
        firstName: userRegistrationModel.firstName,
        lastName: userRegistrationModel.lastName,
        passwordHash: this.crypto.pbkdf2Sync(userRegistrationModel.password, passwordSaltIn, cryptoIterations, cryptoKeyLen),
        passwordSalt: passwordSaltIn
    });

    // console.log(user.passwordHash);

    return new me.ApiResponse({ success: true, extras: { user: user } });
}

module.exports = AccountController;
