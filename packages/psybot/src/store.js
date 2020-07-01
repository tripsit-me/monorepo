'use strict';

module.exports = function createStore() {
	const state = { channels: [] };

	return {
		state,
		addChannels(channels) {
			Object.assign(state, { channels: state.channels.concat(channels) });
		},
	};
};
