'use strict';

const createStore = require('../store');

test('addChannels', () => {
	const { state, addChannels } = createStore();
	expect(state.channels).toEqual([]);
	expect(addChannels('a')).toBe(undefined);
	expect(state.channels).toEqual(['a']);
	expect(addChannels(['b', 'c'])).toBe(undefined);
	expect(state.channels).toEqual(['a', 'b', 'c']);
});
