'use strict';

module.exports = function ({ client, event, config }) {
	if (event.invited === config.nick) {
		const channel = client.channel(event.channel);
		channel.join();
		channel.updateUsers();
	}
};
