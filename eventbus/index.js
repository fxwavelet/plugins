/**
 * Created by B.HOU on 5/6/2015.
 */

module.exports = function (options, imports, register) {
  var emitter = require('./eventbus');

  register(null, {
    "eventbus": {
      emit: emitter.emit,
      on: emitter.on,
      listeners: emitter.listeners,
      removeListener: emitter.removeListener
    }
  });
};