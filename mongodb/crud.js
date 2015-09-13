var async = require('async');

var ObjectID = require('mongodb').ObjectID;

function insert(logger, db, collection, doc, options, done) {
  var c = db.collection(collection);

  c.insert(doc, options, function (err, result) {
    if (err) {
      return done(err);
    }

    return done(null, result.ops);
  });
}

function find(logger, db, collection, query, field, options, done) {
  var c = db.collection(collection);
  c.find(query, field, options).toArray(done);
}

function update(logger, db, collection, query, doc, options, done) {
  var c = db.collection(collection);
  c.update(query, doc, options, function (err, result) {
    if (err) {
      return done(err);
    }

    return done(null, result.result);
  });
}

function remove(logger, db, collection, query, options, done) {
  var c = db.collection(collection);
  c.deleteMany(query, options, function (err, result) {
    if (err) {
      return done(err);
    }

    return done(null, result.result);
  });
}

function aggregate(logger, db, collection, pipeline, options, done) {
  var c = db.collection(collection);
  c.aggregate(pipeline, options, function (err, result) {
    if (err) {
      return done(err);
    }

    return done(null, result);
  });
}

function mapReduce(logger, db, collection, map, reduce, options, done) {
  var c = db.collection(collection);
  c.mapReduce(map, reduce, options, function (err, result) {
    if (err) {
      return done(err);
    }

    return done(null, result);
  });
}

function ensureIndex(logger, db, collection, name, keys, options, done) {
  var c = db.collection(collection);

  c.indexExists(name, function(err, exists) {
    if (err) {
      return done(err);
    }

    if (!exists) {
      c.createIndex(keys, options, function(error, result) {
        if (error) {
          return done(error);
        }

        return done();
      });
    }

    done();
  });
}

module.exports = {
  insert: insert,
  find: find,
  update: update,
  remove: remove,
  aggregate: aggregate,
  mapReduce: mapReduce,
  ensureIndex: ensureIndex
};