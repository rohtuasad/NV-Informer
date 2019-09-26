var User = require("../models/user");

exports.getAllUsers = function(callback) {
  User.find({}, callback);
};

exports.updatePermissions = function(newRoles, callback) {
  User.find({}, function(err, users) {
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var userRoles = newRoles[user.local.login];
      updateUserRoles(userRoles, user);
      user.save();
    }
    callback(users);
  });
};

function updateUserRoles(userRoles, user) {
  if (userRoles) {
    if (typeof userRoles === "string") {
      user.local.roles = [userRoles];
    } else {
      user.local.roles = userRoles;
    }
  } else {
    user.local.roles = [];
  }
}
