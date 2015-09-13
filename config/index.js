
var configBuilder = require('./configBuilder');

var _conf = null;

module.exports = function(options, imports, register) {
  register(null, {
    "config": {
      "create": function(defaultConfig) {
        return configBuilder(defaultConfig);
      },
      "shared": function() {
        if (!_conf) {
          _conf = configBuilder();
        }
        return _conf;
      }
    }
  });
};