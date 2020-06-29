'use strict';

const config = require('../../../config');

module.exports = function withPmOnly(fn) {
	return (deps, ...args) => (deps.event.target === config.nick
		? fn(deps, ...args)
		: deps.event.reply('This command is only available through PM'));
};
