// Mailer Mock Class has responsibility of sending password reset email
var MailerMock = function() {};

MailerMock.prototype.sendPasswordResetHash = function(email, passwordResetHash) {};

module.exports = MailerMock;
