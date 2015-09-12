/**
 * Created by B.HOU on 5/6/2015.
 */

module.exports = function (options, imports, register) {
  var http = require('http');
  var express = require('express');

  var webapp = express();

  var server = http.createServer(webapp);

  if (options.enableCORS == true) {
    webapp.all('*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  register(null, {
    "express": express,
    "webapp": webapp,
    "server": server
  });
};

