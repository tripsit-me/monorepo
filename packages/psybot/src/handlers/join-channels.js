'use strict';

module.exports = function joinChannelsHandler({ client, config }) {
	config.channels
		.map(channel => client.channel(channel))
		.forEach(channel => {
			channel.join();
			channel.updateUsers();
		});
};
