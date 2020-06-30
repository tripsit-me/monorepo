'use strict';

const debug = require('./debug');
const nickserv = require('./nickserv');

function createMiddleware(fn) {
	return (...args) => (middlewareClient, rawEvents, parsedEvents) => {
		parsedEvents.use(
			async (command, event, client, next) => next(await fn({ event, client, command }, ...args)),
		);
	};
}

module.exports = Object.fromEntries(Object.entries({ debug, nickserv })
	.map(([k, v]) => [k, createMiddleware(v)]));
