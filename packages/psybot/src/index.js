'use strict';

const { Client } = require('irc-framework');
const knex = require('knex');
const knexConfig = require('../knexfile');
const createLogger = require('./logger');
const middleware = require('./middleware');
const createHandlers = require('./handlers');

module.exports = function createPsybot(config) {
	const logger = createLogger();
	const client = new Client({ encoding: 'utf8' });
	const db = knex(knexConfig);
	const deps = {
		config,
		logger,
		client,
		db,
	};

	// Apply middleware
	if (process.env.DEBUG === 'true') client.use(middleware.debug(deps));
	client.use(middleware.nickserv(deps));

	// Apply event handlers
	const handlers = createHandlers(deps);
	client.on('registered', handlers.joinChannels());
	client.on('invite', handlers.invite());
	client.on('message', handlers.commands());

	client.connect({
		host: config.host,
		port: config.port,
		nick: config.nick,
	});

	return client;
};
