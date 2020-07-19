'use strict';

/**
 * Trait dependencies:
 *  - withUser
 */
function createWithPermissions(requiredPermissions) {
	return fn => async (deps, ...args) => (requiredPermissions.includes(deps.user.role)
		? fn(deps, ...args)
		: deps.event.reply('You do not have permission to execute this command.'));
}

module.exports = createWithPermissions;
