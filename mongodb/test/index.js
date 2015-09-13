var assert = require('assert');
var async = require('async');

function getService(done) {
  var getMongodbService = require('../index');

  getMongodbService({
      host: '',
      port: '',
      database: '',
      user: '',
      password: ''
    }
    , {
      logger: {
        "getLogger": function (name) {
          return {
            info: function (msg) {
              console.log(msg)
            },
            warn: function (msg) {
              console.log(msg)
            },
            error: function (msg) {
              console.log(msg)
            },
          }
        }
      }
    }, done);
}

function connect(done) {
  getService(function (err, services) {
    if (err) {
      return done(err);
    }

    var mongodb = services.mongodb;

    // get default connection
    mongodb.getConnection(null, function (err, connection) {
      if (err) {
        return done(err);
      }
      done(null, connection);
    });
  });
}

module.exports = {
  'beforeEach': function (done) {
    this.timeout(5000);
    connect(function (err, mongodb) {
      if (err) {
        return done(err);
      }
      mongodb.remove('test-collection', {
        'name': {
          $eq: 'John'
        }
      }, {}, done);
    });
  },
  'fx-mongodb': {
    '#access mongodb': {
      'should connect': function (done) {
        connect(done);
      },

      'should create item': function (done) {
        connect(function (err, mongodb) {
          if (err) {
            return done(err);
          }

          mongodb.insert('test-collection', {
            name: 'John',
            age: 40
          }, {
            // no special options
          }, function (err, item) {
            if (err) {
              return done(err);
            }
            return done();
          });

        });
      },

      'should find item': function (done) {
        connect(function (err, mongodb) {
          if (err) {
            return done(err);
          }

          async.series([
            function (cb) {
              mongodb.insert('test-collection', {
                name: 'John',
                age: 40
              }, {}, cb);
            },
            function (cb) {
              mongodb.find('test-collection', {
                'name': 'John'
              }, {}, {}, function (err, items) {
                if (err) {
                  return cb(err);
                }
                console.log(items);

                assert(items.length > 0);
                assert.equal(items[0]['name'], 'John');
                assert.equal(items[0]['age'], 40);
                return cb();
              });
            }
          ], function (err, results) {
            if (err) {
              return done(err);
            }
            done();
          });
        });
      },

      'should update item': function (done) {
        connect(function (err, mongodb) {
          if (err) {
            return done(err);
          }

          async.series([
            function (cb) {
              mongodb.insert('test-collection', {
                name: 'John',
                age: 40
              }, {}, cb);
            },
            function (cb) {
              mongodb.update('test-collection', { // query
                'name': 'John'
              }, { // doc
                $set: {
                  'age': 30
                }
              }, { // options
              }, cb);
            },
            function (cb) {
              mongodb.find('test-collection', {
                'age': 30
              }, {}, {}, function (err, items) {
                if (err) {
                  return cb(err);
                }

                assert(items.length > 0);
                assert.equal(items[0]['name'], 'John');
                assert.equal(items[0]['age'], 30);
                return cb();
              });
            }
          ], function (err, results) {
            if (err) {
              return done(err);
            }
            done();
          });
        });
      }
    }
  }
};