module.exports = function (config) {
  var winston = require('winston');

  /**
   * create a logger with module name
   * @param name
   * @constructor
   */
  function Logger(name) {
    this.name = name;

    var transports = [];
    if (config.transports) {
      for (var i = 0; i < config.transports.length; i++) {
        if (config.transports[i] == 'console') {
          transports.push(new (winston.transports.Console)({
            level: config.level ? config.level : 'info'
          }));
        }

        if (config.transports[i] == 'file') {
          transports.push(new (winston.transports.File)({
            filename: config.file ? config.file : 'app.log',
            level: config.level ? config.level : 'info'
          }));
        }
      }
    }

    // hanld default case
    if (transports.length == 0) {
      transports.push(new (winston.transports.Console)({
        level: config.level ? config.level : 'info'
      }));
    }

    this.logger = new (winston.Logger)({
      transports: transports
    });
  };

  Logger.prototype.getRawLogger = function () {
    return this.logger;
  };

  /**
   * log info level log
   */
  Logger.prototype.info = function () {
    var args = Array.prototype.slice.call(arguments);

    if (args.length > 0) {
      args[0] = '[' + this.name + '] ' + args[0];
    }

    this.logger.info.apply({}, args);
  };

  /**
   * log warning level log
   */
  Logger.prototype.warn = function () {
    var args = Array.prototype.slice.call(arguments);

    if (args.length > 0) {
      args[0] = '[' + this.name + '] ' + args[0];
    }

    this.logger.warn.apply({}, args);
  };

  /**
   * log error level log
   */
  Logger.prototype.error = function () {
    var args = Array.prototype.slice.call(arguments);

    if (args.length > 0) {
      args[0] = '[' + this.name + '] ' + args[0];
    }

    this.logger.error.apply({}, args);
  };

  return Logger;
};