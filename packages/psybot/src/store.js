'use strict';

const path = require('path');
const fs = require('fs').promises;

module.exports = async function createStore({ logger }) {
	const state = {
		channels: [],
	};

	return {
		joinChannel(name) {
			Object.assign(state, {
				channels: state.channels.concat({
					name,
					log: fs.createWriteStream(path.resolve(`logs/channel/${name}.log`)),
				}),
			});
		},

		leaveChannel(name) {
			const channel = state.channels.find(a => a.name === name);
			if (!channel) return logger.info(`Not currently in channel '${name}'`);
			Object.assign(state, { channels: state.channels.filter(a => a !== channel) });
		},
	};
};
