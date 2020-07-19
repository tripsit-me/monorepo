'use strict';

const withUser = require('./traits/with-user');
const { compose } = require('../util');

function withArgs(fn) {
	return async (deps, replyStr, ...extras) => {
		const { event, user } = deps;

		if (!replyStr) {
			event.reply('Please provide a reply string');
			return null;
		}

		const issuedNick = user.nick;

		const extraStr = extras.length
			? extras.map((str, idx) => ''.concat(idx, ': ', str)).join(' ')
			: '';

		return fn(
			deps,
			replyStr,
			issuedNick,
			extraStr,
		);
	};
}

// TODO add user name randomly
async function pingCommand({ event }, replyStr, issuedNick, extraStr) {
	const pong = 'Pong '.concat(issuedNick, '! ', replyStr, ' ', extraStr);
	event.reply(pong);
}

module.exports = compose(
	withUser,
	withArgs,
)(pingCommand);
