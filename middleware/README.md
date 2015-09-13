# Plugin: fx-middleware

## Description
Common express middlewares. Implement the **middleware** service

## Config
specify the argument **--middleware [config file path]** to config the middleware, or directly put the configuration in your app.js

This plugin predefined several middlewares in it:
#### morgan
web app server log middleware

config it with 'morgan' field

default:
`````javascript
"fx-middleware": {  // the config for fx-middleware plugin
    morgan: {
      path: global.home + '/logs'
      format: 'short', // combined, common, dev, short, tiny, or user defined
      filePrefix: 'access_'
    }
}
`````

#### cookieParser
express cookie parser middleware
`````javascript
var cookieParser = require('cookie-parser');
return cookieParser()
`````

#### urlEncodedParser
`````javascript
var bodyParser = require('body-parser');
return bodyParser().urlencoded({
  extended: true
})
`````

#### jsonParser
`````javascript
var bodyParser = require('body-parser');
return bodyParser().json()
`````

#### session
support three types of session:

- memory
- mongodb
- redis (Not yet implemented)

Config the session types with 'sessionStore' config key
default: 'memory'

Config the session secret with 'sessionSecret'

Mongodb configuration is defined in **mongodb** service

Redis configuration is defined in **redis** service

#### compression
`````javascript
var compression = require('compression');
return compression()
`````


## Interface

You need to consume **middlewares** service in your plugin, and get middlewares instance with following code:
`````javascript
var middlewares = imports.middlewares;
`````

### middlewares.all([Optional, Array(String)] list)
get a list of instances of registered middlewares. Or get the instances of middlewares specified in the list.

By default, the list of middlewares are:
`````javascript
[
    'morgan',
    'cookieParser',
    'urlEncodedParser',
    'jsonParser',
    'session'
];
`````


### middlewares.register([String] name, [function] middleware, [optional, int] index)
Register a middleware named **name** at the index**th** position of the middleware list. If index parameter is not found, the middleware is appended at the end of the list

For example, we could register a new **test** middleware after **jsonParser** by following code:

`````javascript
middlewares.register('test', function(req, res, next){
    // your middlewere code here
    next();
}, 4);
`````

### middlewares.remove([String] name)
Remove a middleware from list
