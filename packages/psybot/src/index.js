'use strict';

const { Client } = require('irc-framework');
const middleware = require('./middleware');
const commands = require('./commands');

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

	client.on('message', event => {
		if (!event.message.trim().startsWith('!')) return null;
		const [commandName, ...args] = event.message
			.trim()
			.slice(1)
			.split(/\s+/g);

		const command = commands[commandName];
		return command
			? command({ event }, ...args)
			: event.reply(`There is no command by '${commandName}'`);
	});

	client.connect({
		host: config.host,
		port: config.port,
		nick: config.nick,
	});

	return client;
};
