'use strict';

module.exports = function withChannelUsers(fn) {
	return async (deps, ...args) => fn({
		...deps,
		channel: await deps.store.getChannel(deps.event.target),
	}, ...args);
};
