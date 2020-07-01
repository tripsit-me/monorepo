'use strict';

module.exports = function joinChannelsHandler({ client, config, store }) {
	store.addChannels(config.channels
		.map(channel => client.channel(channel))
		.map(channel => {
			channel.join();
			channel.updateUsers();
			return channel;
		}));
};
