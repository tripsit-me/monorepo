'use strict';

const withPmOnly = require('../with-pm-only');

jest.mock('../../../../config', () => ({ nick: 'PsyBot-test-config' }));

test('If event.target !== event.nick reply with message and do not run command', () => {
	const command = jest.fn();
	const event = {
		reply: jest.fn(),
		target: '#welcome',
	};
	withPmOnly(command)({ event });
	expect(command).not.toHaveBeenCalled();
	expect(event.reply).toHaveBeenCalledWith('This command is only available through PM');
});

test('Runs command if target and nick match sending no message', () => {
	const command = jest.fn();
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
	};
	withPmOnly(command)({ event }, 'foo', 'bar');
	expect(command).toHaveBeenCalledWith({ event }, 'foo', 'bar');
	expect(event.reply).not.toHaveBeenCalled();
});
