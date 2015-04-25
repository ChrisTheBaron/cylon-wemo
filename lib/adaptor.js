/*
 * cylon-wemo adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2015 Chris Taylor
 * Licensed under the MIT License (MIT).
 */

"use strict";

var Cylon = require("cylon"),
	WeMo = require("./wemo"),
	Commands = require("./commands");

var Adaptor = module.exports = function Adaptor(opts) {

	Cylon.Logger.info("Adaptor#construct");

	Adaptor.__super__.constructor.apply(this, arguments);

	this.opts = opts || {};

	this.connector = null;

};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.connect = function (callback) {

	Cylon.Logger.info("Adaptor#connect");

	this.connector = new WeMo(this.opts);

	this.proxyMethods(Commands, this.connector, this);

	callback();

};

Adaptor.prototype.disconnect = function (callback) {

	Cylon.Logger.info("Adaptor#disconnect");

	// Don"t need to do anything

	callback();

};
