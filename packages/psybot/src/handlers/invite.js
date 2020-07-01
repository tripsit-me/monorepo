'use strict';

module.exports = function ({ client, event, store }) {
	const channel = client.channel(event.channel);
	channel.join();
	channel.updateUsers();
	store.addChannels(channel);
};
