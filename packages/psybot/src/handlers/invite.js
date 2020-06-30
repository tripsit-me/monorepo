'use strict';

module.exports = function ({ client, event }) {
	const channel = client.channel(event.channel);
	channel.join();
	channel.updateUsers();
};
