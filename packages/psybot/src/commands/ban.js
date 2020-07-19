'use strict';

const { promisify } = require('util');
const withUser = require('./traits/with-user');
const createWithPermissions = require('./traits/with-permissions');
const { compose, parseUnitArg } = require('../util');

function withArgs(fn) {
	return async (deps, durationArg, userToBan, ...reasonArgs) => {
		const { event, client } = deps;
		const whois = promisify(client.whois);

		if (!durationArg) {
			event.reply('Must provide a duration for the banned user. Zero for perma-ban.');
			return null;
		}
		const duration = durationArg === 'P' ? null : parseUnitArg(durationArg, 'time');
		if (!duration && durationArg !== 'P') {
			event.reply('Invalid duration provided.');
			return null;
		}

		return fn({
			duration,
			reason: reasonArgs.join(' '),
			user: await whois(userToBan),
		});
	};
}

async function banCommand(...args) {
	console.log(...args);
}

module.exports = compose(
	withUser,
	createWithPermissions(['moderator', 'operator']),
	withArgs,
)(banCommand);
