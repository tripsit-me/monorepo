'use strict';

const { Client } = require('irc-framework');
const createPsybot = require('..');
const middleware = require('../middleware');

jest.mock('irc-framework', () => {
	class MockClient {}
	MockClient.prototype.use = jest.fn();
	MockClient.prototype.connect = jest.fn();
	return { Client: MockClient };
});

jest.mock('../middleware', () => ({
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
	expect(createPsybot({
		host: 'mockHost',
		port: 1337,
		nick: 'RadMan1337',
	}))
		.toBeInstanceOf(Client);
	expect(middleware.debug).not.toHaveBeenCalled();
	expect(middleware.nickserv).toHaveBeenCalled();
});

test('Applies middleware if process.env.DEBUG is "true"', () => {
	process.env.DEBUG = 'true';
	createPsybot({
		host: 'mockHost',
		port: 1337,
		nick: 'RadMan1337',
	});
	expect(middleware.debug).toHaveBeenCalled();
});
