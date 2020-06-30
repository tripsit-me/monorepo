'use strict';

const joinChannels = require('./join-channels');
const commands = require('./command');
const invite = require('./invite');

module.exports = function createHandlers(deps) {
	return Object.fromEntries(Object.entries({ joinChannels, commands, invite })
		.map(([k, v]) => [k, (...args) => event => v({ ...deps, event }, ...args)]));
};
