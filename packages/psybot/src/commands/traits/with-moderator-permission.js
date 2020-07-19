'use strict';

const withUser = require('./with-user');

function withModeratorPermission(fn) {
	return (deps, ...args) => (['moderator', 'operator'].includes(deps.user.role)
		? fn(deps, ...args)
		: deps.event.reply('You do not have permission to execute this command'));
};

module.exports = withUser(withModeratorPermission);
