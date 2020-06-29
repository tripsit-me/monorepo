'use strict';

module.exports = function withUser(fn) {
	return async (deps, ...args) => {
		const { event, db } = deps;

		const user = await db('users')
			.where('nick', event.nick)
			.first()
			.then(userRecord => userRecord || db('users') // If user does not exist, create them
				.insert({ nick: event.nick })
				.returning('*')
				.then(([newUser]) => newUser));

		return fn({ ...deps, user }, ...args);
	};
};
