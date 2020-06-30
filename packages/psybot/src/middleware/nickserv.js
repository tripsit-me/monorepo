'use strict';

module.exports = function nickservMiddleware({
	client,
	config,
	command,
	event,
}) {
	console.log(config);
	const isNotRegistered = command === 'message'
		&& event.nick.toLowerCase() === 'nickserv'
		&& event.message.endsWith('is not a registered nickname.');

	if (isNotRegistered) client.say('nickserv', `register ${config.password} ${config.recoveryEmail}`.trim());
	else if (command === 'displayed host' && event.nick === config.nick) {
		client.say('nickserv', `identify ${config.password}`);
	}
};
