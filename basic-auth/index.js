var BASIC_AUTH_USERS = "basic-auth-users";
var ENABLE_BASIC_AUTH = "enable-basic-auth";
var DEFAULT_PERMISSION_KEY = "default-permission";

var DEFAULT_PERMISSION_VALUE = "*";

module.exports = function(options, imports, register) {
  var shared = imports.config.shared();

  function getPermission(username, done) {
    var basicAuthUsers = shared.get(BASIC_AUTH_USERS);

    var permission = null;

    if (basicAuthUsers && basicAuthUsers.hasOwnProperty(username)) {
      if (basicAuthUsers[username].hasOwnProperty('permission')) {
        permission = basicAuthUsers[username].permission;
      }
    }

    done(null, permission);
  }

  register(null, {
    "basic-authentication": {
      "isValid": function(username, done) {
        getPermission(username, done);
      },
      "authenticate": function(username, password, done) {
        var basicAuthUsers = shared.get(BASIC_AUTH_USERS);

        if (basicAuthUsers && basicAuthUsers.hasOwnProperty(username)) {
          if (basicAuthUsers[username].hasOwnProperty('password')) {
            var realPassword = basicAuthUsers[username].password;

            if (password == realPassword) {
              return getPermission(username, done);
            }
          }
        }

        return done(null, null);
      },
      "enabled": function() {
        if (shared.get(ENABLE_BASIC_AUTH)) {
          return true;
        }

        return false;
      },
      "defaultPermission":
        shared.get(DEFAULT_PERMISSION_KEY) ? shared.get(DEFAULT_PERMISSION_KEY) : DEFAULT_PERMISSION_VALUE
    }
  });
};