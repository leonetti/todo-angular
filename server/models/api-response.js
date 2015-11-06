// Any request sent to the Controller will eventually produce an
  // ApiResponse instance
// Success: Signals whether the request succeeded or not
// Extras: JavaScript object containing any additional data that the
  // Controller wants to send out as part of the response
var ApiResponse = function(cnf) {
  this.success = cnf.success;
  this.extras = cnf.extras;
};

module.exports = ApiResponse;
