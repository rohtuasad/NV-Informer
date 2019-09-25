var User = require("../models/user");

exports.getAllUsers = function(callback) {
  User.find({}, callback);
};
