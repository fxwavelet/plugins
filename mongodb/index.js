var path = require('path');

if (!path.isAbsolute) {
  path.isAbsolute = function (yourPath) {
    return path.resolve(yourPath) == path.normalize(yourPath)
  }
}
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var configBuilder = require('./config');
var crud = require('./crud');

var pool = {};

function connect(logger, config, done) {
  var host = config.host;
  var port = config.port || 27017;
  var database = config.database;
  var user = config.user;
  var password = config.password;

  var dbUrl = 'mongodb://' + user + ':' + password + '@' + host + ':' + port + '/' + database +
    '?connectTimeoutMS=0&socketTimeoutMS=0';

  var dbKey = getDBKey(config);

  if (pool.hasOwnProperty(dbKey)) {
    return done(null, pool[dbKey]);
  }

  var dbOptions = {
    server: {
      auto_reconnect: true,
      poolSize: 200,
      socketOptions: {
        connectTimeoutMS: 0,
        socketTimeoutMS: 0
      }
    }
  };

  MongoClient.connect(dbUrl, dbOptions, function (err, db) {
    if (err) {
      logger.info('Error connecting to db:', dbUrl);
      return done(err);
    }

    pool[dbKey] = db;
    logger.info('Connected to db:', dbUrl);
    done(null, db);
  });
}

function getDBKey(config) {
  var host = config.host;
  var port = config.port || 27017;
  var database = config.database;

  var dbKey = host + ':' + port + '/' + database;
  return dbKey;
}

var defaultConfig = null;

module.exports = function (options, imports, register) {
  var logger = imports.logger.getLogger('MongoDB');
  defaultConfig = options;

  register(null, {
    "mongodb": {
      "native": mongodb,
      "setDefault": function (def) {
        defaultConfig = def;
      },
      "getDefault": function () {
        return defaultConfig;
      },
      "getConnection": function (config, cb) {
        if (!config) {
          config = defaultConfig;
        }

        if (typeof config == 'function') {
          cb = config;
          config = defaultConfig;
        }

        connect(logger, config, function (err, db) {
          if (err) {
            return cb(err);
          }

          var dbKey = getDBKey(config);
          var DB = db;
          var connection = {
            "config": config,
            "disconnect": function (done) {
              if (DB) {
                DB.close();
                DB = null;

                if (pool.hasOwnProperty(dbKey)) {
                  delete pool[dbKey];
                }
              }
              done();
            },
            "insert": function (collection, doc, options, done) {
              crud.insert(logger, DB, collection, doc, options, done);
            },
            "find": function (collection, query, field, options, done) {
              crud.find(logger, DB, collection, query, field, options, done);
            },
            "update": function (collection, query, doc, options, done) {
              crud.update(logger, DB, collection, query, doc, options, done);
            },
            "remove": function (collection, query, options, done) {
              crud.remove(logger, DB, collection, query, options, done);
            },
            "ensureIndex": function (collection, name, keys, options, done) {
              crud.ensureIndex(logger, DB, collection, name, keys, options, done);
            },
            "aggregate": function (collection, pipeline, options, done) {
              crud.aggregate(logger, DB, collection, pipeline, options, done);
            },
            "mapReduce": function (collection, map, reduce, options, done) {
              crud.mapReduce(logger, DB, map, reduce, options, done);
            }
          };

          return cb(null, connection);
        });
      },
      "ObjectID": mongodb.ObjectID,
      "Binary": mongodb.Binary
    }
  });
};