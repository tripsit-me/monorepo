'use strict';

const convertUnits = require('convert-units');

/**
 * Cleaner method of composing together a series of higher order functions.
 * Example:
 * 	FROM: withFoo(withBar(withBaz(doTheThing)))
 * 	TO:   compose(withBaz, withBar, withFoo)(doTheThing)
 */
exports.compose = function (...fns) {
	return a => fns.reduceRight((b, fn) => fn(b), a);
};

exports.parseUnitArg = function (unitArg, unitType) {
	if (!/^\d+[a-z]+$/i.test(unitArg)) return null;
	const value = parseFloat(unitArg.replace(/[a-z]+$/.test(unitArg)));
	if (Number.isNaN(value)) return null;
	const unit = unitArg.replace(/^\d+/, '');
	return unitType && !convertUnits().possibilities(unitType).includes(unit)
		? null
		: { value, unit };
};
