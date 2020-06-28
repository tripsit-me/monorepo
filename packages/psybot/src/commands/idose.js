'use strict';

const { DateTime } = require('luxon');
const convertUnits = require('convert-units');
const withUser = require('./traits/with-user');
const withPmOnly = require('./traits/with-pm-only');
const {	compose, parseUnitArg } = require('../util');

function withArgs(fn) {
	return (deps, ...args) => {
		// Determine how long ago the dose was taken defaulting to now
		const timeOffset = parseUnitArg(args[args.length - 1], 'time');
		const remainingArgs = timeOffset ? args.slice(0, -1) : args;

		// Determine dose
		const dose = parseUnitArg(args[0], 'mass');
		if (!dose) {
			deps.event.reply('Please provide a dosage for the substance. '
				+ 'Run !help idose for additional assistance.');
		} else {
			const substance = remainingArgs
				.slice(1)
				.join(' ')
				.toLowerCase();
			fn(deps, substance, dose, timeOffset);
		}
	};
}

async function idoseCommand({ event, db, user }, substance, dose, timeOffset) {
	const dosedAt = DateTime
		.utc()
		.minus(timeOffset ? convertUnits(timeOffset.value).from(timeOffset.unit).to('ms') : 0)
		.toJSDate();

	await db('doses').insert({
		substance,
		dosedAt,
		userId: user.id,
		milligrams: convertUnits(dose.value)
			.from(dose.unit)
			.to('mg'),
	});

	event.reply(`${event.nick} dosed ${dose.value}${dose.unit} of ${substance}`
		+ ` at ${dosedAt.toLocaleString()}`);
}

module.exports = compose(withPmOnly, withUser, withArgs)(idoseCommand);
