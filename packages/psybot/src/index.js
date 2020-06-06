'use strict';

const { Client } = require('irc-framework');

module.exports = function createPsybot(config) {
	const client = new Client();
	client.connect(config);

	client.on('debug', console.error);

	return client;
};
