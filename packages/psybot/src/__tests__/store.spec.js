'use strict';

const createStore = require('../store');

test('Can add and get channels', () => {
	const store = createStore();
	expect(store.addChannels([
		{ name: '#a' },
		{ name: '#b' },
		{ name: '#c' },
	]))
		.toBe(undefined);
	expect(store.getChannel('#b')).toEqual({ name: '#b' });
});
