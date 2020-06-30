'use strict';

module.exports = function ({ client, event, config }) {
	const channel = client.channel(event.channel);
	channel.join();
	channel.updateUsers();
};
