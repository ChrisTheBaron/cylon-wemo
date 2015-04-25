'use strict';

console.log("Press Ctrl+C to exit");

var SSDP = require('node-ssdp').Client;
var request = require('request');
var url = require('url');
var xml2js = require('xml2js');

// Search All Devices

var client = new SSDP();

client.stop = client._stop;

client.setMaxListeners(0);

client.on('response', function (msg, rinfo) {
	if (msg.ST === 'urn:Belkin:service:basicevent:1') {
		var location = url.parse(msg.LOCATION);
		request.get(location.href, function (err, res, xml) {
			xml2js.parseString(xml, function (err, json) {
				var device = {ip: location.hostname, port: location.port};
				for (var key in json.root.device[0]) {
					device[key] = json.root.device[0][key][0];
				}
				client.emit('found', device);
			});
		});
	}
});

client.on('found', function (device) {
	console.log("Found: " + device.friendlyName + " @ " + device.ip + ':' + device.port);
});

client.search('urn:Belkin:service:basicevent:1');
