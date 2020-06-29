'use strict';

const { Client } = require('irc-framework');
const knex = require('knex');
const knexConfig = require('../knexfile');
const createLogger = require('./logger');
const middleware = require('./middleware');
const commands = require('./commands');

module.exports = function createPsybot(config) {
	const logger = createLogger();
	const client = new Client({ encoding: 'utf8' });
	const db = knex(knexConfig);

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

		const command = async (...xs) => commands[commandName](...xs);
		return !command
			? event.reply(`There is no command by '${commandName}'`)
			: command({
				client,
				event,
				db,
				logger,
			}, ...args).catch(ex => {
				logger.error(ex);
				return Promise.reject(ex);
			});
	});

	client.connect({
		host: config.host,
		port: config.port,
		nick: config.nick,
	});

	return client;
};
