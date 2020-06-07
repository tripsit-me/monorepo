'use strict';

const { Client } = require('irc-framework');

module.exports = function createPsybot(config) {
	const client = new Client();

	client.connect({
		host: config.host,
		port: config.port,
		nick: config.nick,
	});

	return client;
};
