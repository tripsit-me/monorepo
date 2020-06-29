'use strict';

const { DateTime } = require('luxon');
const convertUnits = require('convert-units');
const withUser = require('./traits/with-user');
const withPmOnly = require('./traits/with-pm-only');
const {	compose, parseUnitArg } = require('../util');

async function lastDose({ event, db, user }, dosesBack = 0) {
	const dose = await db('doses')
		.select('substance', 'dosed_at', 'milligrams')
		.where('user_id', user.id)
		.orderBy('dosed_at', 'desc')
		.limit(1)
		.offset(dosesBack);

	if (!dose) event.reply('There are no recorded doses for this user.');
	else {
		event.reply(`${user.nick} dosed ${dose.milligrams}mg of ${dose.substance} `
			+ `at ${dose.dosedAt.toLocaleString()}`);
	}
}

async function addDose({ event, db, user }, substance, dose, timeOffset) {
	if (substance === 'last') lastDose({ event, db, user });
	else {
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
}

async function doseCommand(deps, ...args) {
	// Last dose
	if ((args.length === 1 || args.length === 2) && args[0] === 'last') {
		return lastDose(deps, args[1]);
	}

	// Add dose
	// Determine how long ago the dose was taken defaulting to now
	const timeOffset = parseUnitArg(args[args.length - 1], 'time');
	const remainingArgs = timeOffset ? args.slice(0, -1) : args;

	// Determine dose
	const dose = parseUnitArg(args[0], 'mass');
	if (!dose) {
		return deps.event.reply('Please provide a dosage for the substance. '
			+ 'Run !help idose for additional assistance.');
	}
	const substance = remainingArgs.slice(1).join(' ');
	return addDose(deps, substance, dose, timeOffset);
}

module.exports = compose(withPmOnly, withUser)(doseCommand);
