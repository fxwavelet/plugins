/**
 * Created by B.HOU on 5/8/2015.
 */

var compression = require('compression');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var multer = require('multer');

var moment = require('moment');
var fs = require('fs');
var async = require('async');

var path = require('path');


function getAbsolutePath(p) {
  var resolvedPath = path.join(global._home, p);

  if (resolvedPath.indexOf(path.normalize(global._home)) == 0) {
    return resolvedPath;
  }

  return null;
}

module.exports = function (options, imports, register) {
  var argv = options.argv;

  var morganConfig = options.morgan || {
      format: 'short', // combined, common, dev, short, tiny, or user defined
      filePrefix: 'access_'
    };

  var sessionStore = argv.sessionStore || options.sessionStore || "memory";
  var sessionSecret = argv.sessionSecret || options.sessionSecret || 'this is a session secret';

  var logPath = morganConfig.path ? morganConfig.path : global._home + '/logs';
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }

  var prefix = morganConfig.filePrefix ? morganConfig.filePrefix : 'access_';
  var accessLogStream = fs.createWriteStream(logPath + '/' + prefix + moment().format('YYYY-MM-DD') + '.log', {
    flags: 'a'
  });

  var multerPath = path.join(global._home, '/public/upload');
  if (options.multerPath) {
    var p = getAbsolutePath(options.multerPath);
    if (p) {
      multerPath = p;
    }
  }

  var logger = imports.logger.getLogger('Middleware');
  var mongodb = imports.mongodb;

  var tasks = [
    function (cb) {
      var defaultSetting = {
        resave: false,
        saveUninitialized: true,
        secret: sessionSecret
      };
      if (sessionStore == "mongodb") {
        mongodb.connect(function (err, db) {
          if (err) {
            // Only log the error, do not block the process
            logger.error(err.message);
          }

          var MongoStore = require('fx-connect-mongo')(session);
          defaultSetting.store = new MongoStore({db: db});
          cb(null, defaultSetting);
        });
      } else {
        cb(null, defaultSetting);
      }

    }
  ];

  async.series(tasks, function (err, results) {
    var sessionStore = results[0];

    var middlewares = {
      'morgan': morgan(morganConfig.format, {
        stream: accessLogStream
      }),
      'cookieParser': cookieParser(),
      'urlEncodedParser': bodyParser.urlencoded({
        extended: true
      }),
      'jsonParser': bodyParser.json(),
      'multer': multer({dest: multerPath}),
      'session': session(sessionStore),
      'compresson': compression()
    };

    var middlewareList = [
      'morgan',
      'cookieParser',
      'urlEncodedParser',
      'jsonParser',
      'session'
    ];

    register(null, {
      "middlewares": {
        "all": function(list) {
          if (!list) {
            list = middlewareList;
          }
          var mws = [];
          var key = null;
          for (var i = 0; i < list.length; i++) {
            key = list[i];
            if (middlewares.hasOwnProperty(key)) {
              mws.push([key, middlewares[key]]);
            }
          }
          return mws;
        },
        "register": function(name, middleware, index) {
          middlewares[name] = middleware;

          if (index != 0 && !index) {
            index = middlewareList.length;
          }
          if (index > middlewareList.length) {
            index = middlewareList.length;
          } else if (index < 0) {
            index = 0;
          }

          middlewareList.splice(index, 0, name);
        },
        "remove": function(name) {
          if (middlewares.hasOwnProperty(name)) {
            delete middlewares[name];
          }

          var index = middlewareList.indexOf(name);
          if (index >= 0) {
            middlewareList.splice(index, 1);
          }
        }
      }
    });
  });
};