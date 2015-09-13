# Plugin: fx-mongodb

## Description
mongodb native mongo driver service implementation

## Implemented Services

- mongodb

## Interface

`````javascript
var mongodb = imports.mongodb;
`````

#### mongodb.native
Get native mongodb instance, it is the instance returned from following code:
````javascript
return require('mongodb');
````

When using this native mongodb instance, you can access all the APIs defined in [MongoDB Office Site](https://docs.mongodb.org/manual/)

We wrap some of these APIs to ease your developement:

#### mongodb.ObjectID
mongodb ObjectID class

#### Binary
mongodb Binary class

#### setDefault(config)
Set default configuration

config.host
config.port
config.databse
config.user
config.password

#### getDefault()
Get default configuration

config.host
config.port
config.databse
config.user
config.password

#### getConnection(config, done)
Get mongodb instance. If config is null or not defined, the default connection is returned the second parameter of callback *done*.

Parameters:

config.host
config.port
config.databse
config.user
config.password

done(error, connection)

[**Object 'connection'**] has following methods/properties:

##### config
configuartion object

config.host
config.port
config.databse
config.user
config.password

##### disconnect(done)
disconnect the mongodb database

##### insert(collection, doc, options, done)
insert a *doc* to *collection* with *options*

##### find(collection, query, field, options, done)
find all *doc*(s) in *collection* with *query* and return only the *field*

##### update(collection, query, doc, options, done)
update *doc*(s) in *collection* with *query* and *options*

##### remove(collection, query, options, done)
remove *doc*(s) in *collection* with *query* and *options*

##### ensureIndex(collection, name, keys, options, done)
ensure index exist otherwise create it

##### aggregate(collection, pipeline, options, done)
aggregate

##### mapReduce(collection, map, reduce, options, done)
map reduce
