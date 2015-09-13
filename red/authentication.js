var when = require("when");

module.exports = function (basicAuth) {
  return {
    type: "credentials",
    users: function (username) {
      return when.promise(function (resolve) {
        // Do whatever work is needed to check username is a valid
        // user.
        basicAuth.isValid(username, function (err, permission) {
          if (permission) {
            // Resolve with the user object. It must contain
            // properties 'username' and 'permissions'
            var user = {username: username, permissions: permission};
            resolve(user);
          } else {
            // Resolve with null to indicate this user does not exist
            resolve(null);
          }
        });
      });
    }

    ,
    authenticate: function (username, password) {
      return when.promise(function (resolve) {
        // Do whatever work is needed to validate the username/password
        // combination.
        basicAuth.authenticate(username, password, function (err, permission) {
          if (permission) {
            // Resolve with the user object. Equivalent to having
            // called users(username);
            var user = {username: username, permissions: permission};
            resolve(user);
          } else {
            // Resolve with null to indicate the username/password pair
            // were not valid.
            resolve(null);
          }
        });
      });
    }
    ,
    default: function () {
      return when.promise(function (resolve) {
        // Resolve with the user object for the default user.
        // If no default user exists, resolve with null.
        if (basicAuth.enabled()) {
          resolve(null);
        } else {
          resolve({anonymous: true, permissions: basicAuth.defaultPermission});
        }
      });
    }
  }
};
