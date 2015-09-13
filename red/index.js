/**
 * Created by B.HOU on 5/6/2015.
 */
var path = require('path');

if (!path.isAbsolute) {
  path.isAbsolute = function(yourPath) {
    return path.resolve(yourPath) == path.normalize(yourPath)
  }
}

module.exports = function(options, imports, register) {
  var logger = imports.logger.getLogger("Red");

  var basicAuth = imports['basic-authentication'];

  var argv = options.argv;
  var middlewareList = options.middlewares;

  //var RED = require('./node-red-customized/red/red');
  var RED = require('fx-node-red');

  var app = imports.waveletApp;
  var server = imports.server;
  var middlewares = imports.middlewares.all(middlewareList);

  var settings = options;

  if (!settings.editorTheme) {
    settings.editorTheme = require('./wavelet-theme');
  }

  /* update settings from arguments */
  if (argv.flow) { // flow file argument
    settings.flowFile = argv.flow;
  }

  settings.httpAdminRoot = global._root + settings.httpAdminRoot;
  settings.httpNodeRoot = global._root + settings.httpNodeRoot;

  /* import the global context for function node */
  if (!settings.functionGlobalContext) {
    settings.functionGlobalContext = {};
  }

  settings.functionGlobalContext.getService = function(service) {
    return global.runtime.getService(service);
  };

  settings.functionGlobalContext.getVariable = function(name) {
    if (global.hasOwnProperty(name)) {
      return global[name];
    }

    return null;
  };

  var nodeMiddlewares = [];
  var key = null;
  for (var i = 0; i < middlewares.length; i++) {
    key = middlewares[i][0];
    if (argv.d) {
      logger.info("Installing middleware '", key, "' for node red");
    }
    nodeMiddlewares.push(middlewares[i][1]);
  }

  settings.httpNodeMiddleware = function(req, res, next) {
    var i = 0;

    function _next(err) {
      if (err) {
        return next(err);
      }
      if (nodeMiddlewares.length <= i) {
        next();
      } else {
        nodeMiddlewares[i++](req, res, _next);
      }
    }
    _next();
  };

  settings.adminAuth = require("./authentication")(basicAuth);

  /* start RED */
  RED.init(server, settings);

  // Serve the editor UI from /red
  app.use(settings.httpAdminRoot, RED.httpAdmin);

  // Serve the http nodes UI from /api
  app.use(settings.httpNodeRoot, RED.httpNode);

  if (!argv.disableEditor && !argv.disableRED) {
    RED.start();
  }

  register(null, {
    "red": RED
  });
};