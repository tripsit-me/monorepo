'use strict';

const command = require('../command');
const commands = require('../../commands');

jest.mock('../../commands');

const event = { reply: jest.fn() };
const logger = { error: jest.fn() };

beforeEach(() => {
	jest.resetAllMocks();
});

test('Does nothing if message does not start with the commandPrefix config', () => {
	command({
		logger,
		event: { ...event, message: '!sillycommand' },
		config: { commanPrefix: '~' },
	});
	expect(event.reply).not.toHaveBeenCalled();
	expect(logger.error).not.toHaveBeenCalled();
});

test('Responds if command does not exist', () => {
	command({
		logger,
		event: { ...event, message: '~sillycommand' },
		config: { commandPrefix: '~' },
	});
	expect(event.reply).toHaveBeenCalledWith('There is no command by \'sillycommand\'.');
	expect(logger.error).not.toHaveBeenCalled();
});

test('Calls command if exists', async () => {
	commands.dose.mockImplementation(() => event.reply('dose mock response'));
	await expect(command({
		logger,
		event: { ...event, message: '~dose 20mg goofballs' },
		config: { commandPrefix: '~' },
	}));
	expect(event.reply).toHaveBeenCalledWith('dose mock response');
	expect(logger.error).not.toHaveBeenCalled();
	expect(commands.dose).toHaveBeenCalled();
});

test('On command error logs result', async () => {
	commands.dose.mockRejectedValue('is broken');
	await expect(command({
		logger,
		event: { ...event, message: '~dose goofballs' },
		config: { commandPrefix: '~' },
	}))
		.rejects.toBe('is broken');
	expect(event.reply).not.toHaveBeenCalled();
	expect(logger.error).toHaveBeenCalledWith('is broken');
	expect(commands.dose).toHaveBeenCalled();
});
