var assert = require('assert');

module.exports = {
  'config': {
    '#static config': {
      'should have different properties': function (done) {
        var getConfig = require('../index');

        getConfig({}, {}, function (err, services) {
          var config = services.config;

          var config1 = config.create({
            prop1: 'value1',
            prop2: 'value2'
          });

          var config2 = config.create({
            prop1: 'valueA',
            prop2: 'valueB'
          });

          assert.equal(config1.get('prop1'), 'value1');
          assert.equal(config2.get('prop1'), 'valueA');

          done();
        });
      }
    },
    '#dynamic config': {
      'should have different properties': function (done) {
        var getConfig = require('../index');

        getConfig({}, {}, function (err, services) {
          var config = services.config;

          var config1 = config.create();

          var config2 = config.create();

          config1.set('prop1', 'value1');
          config2.set('prop1', 'valueA');

          assert.equal(config1.get('prop1'), 'value1');
          assert.equal(config2.get('prop1'), 'valueA');

          done();
        });
      }
    },
    '#shared config': {
      'should be shared': function (done) {
        var getConfig = require('../index');

        getConfig({}, {}, function (err, services) {
          var config = services.config;

          var config1 = config.shared();

          var config2 = config.shared();

          config1.set('prop1', 'value1');

          assert.equal(config1.get('prop1'), 'value1');
          assert.equal(config2.get('prop1'), 'value1');

          config2.set('prop1', 'valueA');

          assert.equal(config1.get('prop1'), 'valueA');
          assert.equal(config2.get('prop1'), 'valueA');

          done();
        });
      }
    }
  }
};