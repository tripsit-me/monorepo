'use strict';

const invite = require('../invite');

test('Joins invited channel', () => {
	const channel = {
		join: jest.fn(),
		updateUsers: jest.fn(),
	};
	const client = { channel: jest.fn().mockReturnValue(channel) };
	const store = { addChannels: jest.fn() };

	expect(invite({
		client,
		store,
		event: { channel: '#nobees' },
	}))
		.toBe(undefined);
	expect(channel.join).toHaveBeenCalled();
	expect(channel.updateUsers).toHaveBeenCalled();
	expect(store.addChannels).toHaveBeenCalledWith(channel);
});
