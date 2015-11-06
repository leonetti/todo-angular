// Gives us data transfer object: can send from the Controller to the website
// Not storing password info in this Model so no opportunity for this info to be
  // pulled from the database and sent out as part of an HTTP response
var UserProfileModel = function(cnf) {
  this.email = cnf.email,
  this.firstName = cnf.firstName,
  this.lastName = cnf.lastName
};

module.exports = UserProfileModel;
