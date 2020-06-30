'use strict';

const { Client } = require('irc-framework');
const createPsybot = require('..');

jest.mock('irc-framework', () => {
	class MockClient {}
	MockClient.prototype.on = jest.fn();
	MockClient.prototype.use = jest.fn();
	MockClient.prototype.connect = jest.fn();
	MockClient.prototype.channel = jest.fn().mockReturnValue({
		join: jest.fn(),
		updateUsers: jest.fn(),
	});
	return { Client: MockClient };
});

jest.mock('../middleware', () => jest.fn().mockReturnValue({
	debug: jest.fn(),
	nickserv: jest.fn(),
}));

beforeEach(() => {
	jest.clearAllMocks();
});

const originalEnv = { ...process.env };
afterEach(() => {
	process.env = originalEnv;
});

test('Does not apply the debug middleware if process.env.DEBUG is not "true"', () => {
	const { client, middleware } = createPsybot({
		host: 'mockHost',
		port: 1337,
		nick: 'RadMan1337',
		channels: [],
	});
	expect(client).toBeInstanceOf(Client);
	expect(middleware.debug).not.toHaveBeenCalled();
	expect(middleware.nickserv).toHaveBeenCalled();
});

test('Applies middleware if process.env.DEBUG is "true"', () => {
	process.env.DEBUG = 'true';
	const { middleware } = createPsybot({
		host: 'mockHost',
		port: 1337,
		nick: 'RadMan1337',
		channels: [],
	});
	expect(middleware.debug).toHaveBeenCalled();
});

test('Joins all channels defined in configuration', () => {
	const { client } = createPsybot({
		host: 'mockHost',
		port: 1337,
		nick: 'RadMan1337',
		channels: ['#foo', '#bar', '#baz'],
	});
	const registeredHandler = client.on.mock.calls[0][1];
	registeredHandler();
	expect(Client.prototype.channel).toHaveBeenCalledTimes(3);
	expect(Client.prototype.channel.mock.calls).toEqual([['#foo'], ['#bar'], ['#baz']]);
});
