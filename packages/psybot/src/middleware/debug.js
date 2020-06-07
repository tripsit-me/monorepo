'use strict';

module.exports = function debugMiddleware({ command, event }) {
	console.log(command, event);
};
