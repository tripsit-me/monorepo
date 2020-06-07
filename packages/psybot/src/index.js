'use strict';

const { Client } = require('irc-framework');
const middleware = require('./middleware');

module.exports = function createPsybot(config) {
	const client = new Client({ encoding: 'utf8' });

	if (process.env.DEBUG === 'true') client.use(middleware.debug());
	client.use(middleware.nickserv(config));

	client.on('registered', () => {
		config.channels
			.map(channel => client.channel(channel))
			.forEach(channel => {
				channel.join();
				channel.updateUsers();
			});
	});

	client.connect({
		host: config.host,
		port: config.port,
		nick: config.nick,
	});

	return client;
};
