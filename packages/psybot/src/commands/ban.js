'use strict';

const { promisify } = require('util');
const withUser = require('./traits/with-user');
const withModeratorPermission = require('./traits/with-moderator-permission');
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

async function banCommand({ event, db, user, client }, durationArg, userToBan, ...reasonArgs) {

}

module.exports = compose(withUser, withModeratorPermission, withArgs)(banCommand);
