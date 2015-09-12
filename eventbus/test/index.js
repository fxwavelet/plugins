var assert = require('assert');

module.exports = {
	'eventbus': {
		'#emitAndReceive': {
			'should receive message': function(done) {
				var getEventbus = require('../index');

				getEventbus({}, {}, function(err, services) {
					var eventbus = services.eventbus;

					eventbus.on('test', function(msg) {
						if (msg == 'test message') {
							done()
						} else {
							done(new Error('Wrong message!'));
						}
					});

					eventbus.emit('test', 'test message');
				});
			}
		}
	}
};