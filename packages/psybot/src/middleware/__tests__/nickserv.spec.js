'use strict';

const nickserv = require('../nickserv');

const client = { say: jest.fn() };

beforeEach(() => {
	jest.clearAllMocks();
});

test('If nick is not registered, register it', () => {
	nickserv(
		{
			client,
			command: 'message',
			event: {
				nick: 'NickServ',
				message: 'SwagMaster9000 is not a registered nickname.',
			},
		},
		{
			nick: 'SwagMaster9000',
			password: 'hunter2',
			recoveryEmail: 'trains@example.com',
		},
	);
	expect(client.say).toHaveBeenCalledTimes(1);
	expect(client.say).toHaveBeenCalledWith('nickserv', 'register hunter2 trains@example.com');
});

test('Identify when displaye host is resolve', () => {
	nickserv(
		{
			client,
			command: 'displayed host',
			event: {
				nick: 'SwagMaster9001',
				password: 'findyourpeace',
			},
		},
		{
			nick: 'SwagMaster9001',
			password: 'findyourpeace',
			recoveryEmail: 'trains@example.com',
		},
	);
	expect(client.say).toHaveBeenCalledTimes(1);
	expect(client.say).toHaveBeenCalledWith('nickserv', 'identify findyourpeace');
});
