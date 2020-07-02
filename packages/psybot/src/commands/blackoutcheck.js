'use strict';

const withUser = require('./traits/with-user');
const { compose, isUserOnline } = require('../util');
const catApi = require('../apis/cat');

async function blackoutcheckCommand({ event, db, user }, target, minutesArg) {
	// Parse and validate arguments
	let minutes;
	if (minutesArg) {
		if (!/^\d+$/.test(minutesArg)) {
			return event.reply('[minutes] Must be a positive whole number.');
		}
		minutes = parseInt(minutesArg, 10);
		if (minutes > 60) return event.reply('Must be a duration of 1hr or less.');
	}
	if (!await isUserOnline(target)) return event.reply(`${target} is not online.`);

	// If not a self test get participant's user ID
	const isSelfTest = user.nick === target;
	const [expectedAnswer, participant] = await Promise.all([
		catApi.get('/v1/images/search').then(([catImage]) => catImage.url),
		db('users')
			.select('id')
			.where('nick', target)
			.first()
			.then(a => {
				if (!a) event.reply(`${a} is not registered in the database.`);
				return a;
			}),
	]);

	await db('blackout_tests').insert({
		minutes,
		expectedAnswer,
		userId: participant.id,
		issuer: isSelfTest ? null : user.id,
	});


}

module.exports = compose(withUser)(blackoutcheckCommand);
