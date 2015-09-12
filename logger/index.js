var loggerBuilder = require("./loggerBuilder");

module.exports = function (options, imports, register) {
  var config = {
    "transports": options.transports,
    "level": options.level
  };

  var Logger = loggerBuilder(config);

  register(null, {
    "logger": {
      "getLogger": function (name) {
        return new Logger(name);
      }
    }
  });
};