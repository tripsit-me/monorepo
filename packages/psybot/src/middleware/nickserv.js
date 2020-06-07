'use strict';

module.exports = function nickservMiddleware(
	{ client, command, event },
	{ nick, password, recoveryEmail },
) {
	const isNotRegistered = command === 'message'
		&& event.nick.toLowerCase() === 'nickserv'
		&& event.message.endsWith('is not a registered nickname.');

	if (isNotRegistered) client.say('nickserv', `register ${password} ${recoveryEmail}`.trim());
	else if (command === 'displayed host' && event.nick === nick) {
		client.say('nickserv', `identify ${password}`);
	}
};
