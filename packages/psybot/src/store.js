'use strict';

module.exports = function createStore() {
	const state = { channels: [] };

	return {
		addChannels(channels) {
			Object.assign(state, { channels: state.channels.concat(channels) });
		},

		getChannel(name) {
			return state.channels.find(channel => channel.name === name);
		},
	};
};
