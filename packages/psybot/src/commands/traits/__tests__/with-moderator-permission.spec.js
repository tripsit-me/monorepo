'use strict';

const withModeratorPermission = require('../with-moderator-permission');

test('If the user does not have moderator permissions display a message and do nothing', () => {
	const command = jest.fn();
	const event = { reply: jest.fn() };
	withModeratorPermission(command)({
		event,
		user: { role: 'alumini' },
	});
	expect(command).not.toHaveBeenCalled();
	expect(event.reply).toHaveBeenCalledWith('You do not have permission to execute this command.');
});

test('If the user is a moderator run the command', () => {
	const command = jest.fn();
	const event = { reply: jest.fn() };
	withModeratorPermission(command)({
		event,
		user: { role: 'moderator' },
	});
	expect(command).toHaveBeenCalled();
	expect(event.reply).not.toHaveBeenCalled();
});

test('If the user is a operator run the command', () => {
	const command = jest.fn();
	const event = { reply: jest.fn() };
	withModeratorPermission(command)({
		event,
		user: { role: 'operator' },
	});
	expect(command).toHaveBeenCalled();
	expect(event.reply).not.toHaveBeenCalled();
});
