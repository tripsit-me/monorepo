'use strict';

const debug = require('./debug');
const nickserv = require('./nickserv');
const log = require('./log');

function applyMiddleware(fn, deps) {
	return (...args) => (middlewareClient, rawEvents, parsedEvents) => {
		parsedEvents.use(
			async (command, event, client, next) => next(await fn({ event, command, ...deps }, ...args)),
		);
	};
}

module.exports = function createMiddleware(deps) {
	return Object.fromEntries(Object.entries({ debug, nickserv, log })
		.map(([k, v]) => [k, applyMiddleware(v, deps)]));
};
