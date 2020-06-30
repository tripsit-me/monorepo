'use strict';

const commands = require('../commands');

module.exports = function commandHandler({
	event,
	db,
	logger,
	...deps
}) {
	if (!event.message.trim().startsWith('!')) return null;
	const [commandName, ...args] = event.message
		.trim()
		.slice(1)
		.split(/\s+/g);

	const command = commands[commandName] && (async (...xs) => commands[commandName](...xs));
	return !command
		? event.reply(`There is no command by '${commandName}'`)
		: command({
			event,
			db,
			logger,
			...deps,
		}, ...args).catch(ex => {
			logger.error(ex);
			return Promise.reject(ex);
		});
};
