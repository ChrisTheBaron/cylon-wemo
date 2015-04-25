/*
 * cylon-rolling-spider
 * http://cylonjs.com
 *
 * Copyright (c) 2014 hecomi
 * 				 2015 Chris Taylor
 * Licensed under the MIT License (MIT).
 */

"use strict";

var http = require("http");
var SSDP = require("node-ssdp").Client;
var url = require("url");
var xml2js = require("xml2js");
var request = require("request");

var os = require("os");

var WeMo = module.exports = function (options) {

	this._options = options || {};

	this._ip = this._options.ip || null;

	if (!this._ip) {
		throw new Error("options.ip is required");
	}

	this._port = this._options.port || 49154;

	this._timeout = this._options.timeout || 5000;

};

WeMo.prototype.getBinaryState = function (callback) {

	var param =
		"  <u:GetBinaryState xmlns:u=\"urn:Belkin:service:basicevent:1\">\n" +
		"  </u:GetBinaryState>\n";

	this._sendSoapCommand("GetBinaryState", param, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		if (result.match(/<BinaryState>(\d)<\/BinaryState>/)) {
			callback(null, RegExp.$1);
		} else {
			callback(new Error("Could not parse response: " + os.EOL +
			os.EOL + result));
		}
	});

};

WeMo.prototype.setBinaryState = function (state, callback) {

	var param =
		"  <u:SetBinaryState xmlns:u=\"urn:Belkin:service:basicevent:1\">\n" +
		"    <BinaryState>" + state + "</BinaryState>\n" +
		"  </u:SetBinaryState>\n";

	this._sendSoapCommand("SetBinaryState", param, function (err, result) {

		if (err) {
			callback(err, null);
		} else {
			callback(null, true);
		}

	});

};

WeMo.prototype._sendSoapCommand = function (action, param, callback) {

	var data =
		"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
		"<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
		"s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n" +
		" <s:Body>\n" +
		param +
		" </s:Body>\n" +
		"</s:Envelope>\n";

	var options = {
		host: this._ip,
		port: this._port,
		path: "/upnp/control/basicevent1",
		method: "POST",
		headers: {
			"SOAPACTION": "\"urn:Belkin:service:basicevent:1#" + action + "\"",
			"Content-Length": data.length,
			"Content-Type": "text/xml; charset=\"utf-8\"",
			"User-Agent": "CyberGarage-HTTP/1.0"
		}
	};

	var req = http.request(options, function (res) {

		res.setEncoding("utf8");

		var body = "";

		res.on("data", function (chunk) {
			body += chunk.toString();
		});

		res.on("end", function () {
			if (res.statusCode === 200) {
				callback(null, body);
			} else {
				callback(new Error("WeMo returned a bad status code: " +
				res.statusCode + os.EOL + os.EOL + body), null);
			}
		});

	});

	req.on("socket", function (socket) {
		socket.setTimeout(this._timeout);
		socket.on("timeout", function () {
			req.abort();
			callback(new Error("Connection to WeMo timed out after " +
			this._timeout));
		}.bind(this));
	}.bind(this));

	req.on("error", function (e) {
		callback(e, null);
	});

	req.write(data);
	req.end();

};
