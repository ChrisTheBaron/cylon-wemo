'use strict';

var Cylon = require('cylon');

Cylon.robot({

	connections: {
		wemo: {
			adaptor: 'wemo', ip: "192.168.0.8", port: 49153
		}
	},

	devices: {
		switch: {
			driver: 'wemo'
		}
	},

	work: function (my) {

		my.switch.setBinaryState(1, function (err, result) {
			console.log(err, result);

			my.switch.getBinaryState(function (err, result) {
				console.log(err, result);

				setTimeout(function () {

					my.switch.setBinaryState(0, function (err, result) {
						console.log(err, result);

						my.switch.getBinaryState(function (err, result) {
							console.log(err, result);

						})

					});

				}, 5000);

			})

		});
	}
}).start();
