'use strict';

const { promisify } = require('util');
const withUser = require('./traits/with-user');
const createWithPermissions = require('./traits/with-permissions');
const { compose, parseUnitArg } = require('../util');

function withArgs(fn) {
	return async (deps, durationArg, userToBan, ...reasonArgs) => {
		const { event, client } = deps;
		// const whois = promisify(client.whois);

		event.reply('foo');

		if (!durationArg) {
			event.reply('Must provide a duration for the banned user. Zero for perma-ban.');
			return null;
		}
		const duration = durationArg === 'P' ? null : parseUnitArg(durationArg, 'time');
		if (!duration && durationArg !== 'P') {
			event.reply('Invalid duration provided.');
			return null;
		}

		return fn(deps, duration, client.whois(userToBan), reasonArgs.join(' '));
	};
}

async function banCommand({ event, db, user }, duration, userToBan, reason) {
	console.log(userToBan);
	event.reply('this is a test');
}

module.exports = compose(
	withUser,
	createWithPermissions(['moderator', 'operator']),
	withArgs,
)(banCommand);
