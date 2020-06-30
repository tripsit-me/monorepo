'use strict';

const withUser = require('./traits/with-user');
const withPmOnly = require('./traits/with-pm-only');
const { compose } = require('../util');

async function lastdoseCommand({ event, db, user }, dosesBackArg) {
	let dosesBack;
	if (dosesBackArg !== undefined) {
		dosesBack = parseInt(dosesBackArg, 10);
		if (Number.isNaN(dosesBack) || dosesBack < 0) {
			return event.reply('Must use a positive number.');
		}
	}

	const query = db('doses')
		.select('substance', 'dosed_at', 'milligrams')
		.where('user_id', user.id)
		.orderBy('dosed_at', 'desc');

	const dose = await (dosesBack !== undefined
		? query.limit(1).offset(dosesBack).then(([a]) => a)
		: query.first());

	if (!dose) event.reply('There are no recorded doses for this user.');
	else {
		event.reply(`${event.nick} dosed ${dose.milligrams}mg of ${dose.substance} `
			+ `at ${dose.dosedAt.toLocaleString()}`);
	}
}

module.exports = compose(withUser, withPmOnly)(lastdoseCommand);
