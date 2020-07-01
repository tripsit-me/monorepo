'use strict';

module.exports = function withChannelUserList(fn) {
	return async (deps, ...args) => {
		console.log(deps);
		return fn(deps, ...args);
	};
};
