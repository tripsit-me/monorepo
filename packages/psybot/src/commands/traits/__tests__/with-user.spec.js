'use strict';

const withUser = require('../with-user');

test('Returns user if exists', async () => {
	const command = jest.fn();
	const event = { nick: 'JoeyPatoey' };
	const db = jest.fn().mockReturnValue({
		where: jest.fn().mockReturnValue({
			first: jest.fn().mockResolvedValue({
				id: 'abc',
				nick: 'JoeyPatoey',
				createdAt: new Date('2016-04-01'),
				updatedAt: new Date('2020-01-04'),
			}),
		}),
	});

	await withUser(command)({ event, db }, 'foo', 'bar');
	expect(command).toHaveBeenCalledWith(
		{
			db,
			event: { nick: 'JoeyPatoey' },
			user: {
				id: 'abc',
				nick: 'JoeyPatoey',
				createdAt: new Date('2016-04-01'),
				updatedAt: new Date('2020-01-04'),
			},
		},
		'foo',
		'bar',
	);
});

test('Creates and returns a new user if does not exist', async () => {
	const command = jest.fn().mockReturnValue('mockReturnValue');
	const event = { nick: 'NewGuy' };

	const mockInsert = jest.fn().mockReturnValue({
		returning: jest.fn().mockResolvedValue([{
			id: 'xyz',
			nick: 'NewGuy',
			createdAt: new Date('2016-05-01'),
			updatedAt: new Date('2020-03-04'),
		}]),
	});
	const db = jest.fn().mockReturnValue({
		where: jest.fn().mockReturnValue({
			first: jest.fn().mockResolvedValue(null),
		}),
		insert: mockInsert,
	});

	await withUser(command)({ event, db }, 'ay', 'yo');
	expect(command).toHaveBeenCalledWith(
		{
			db,
			event: { nick: 'NewGuy' },
			user: {
				id: 'xyz',
				nick: 'NewGuy',
				createdAt: new Date('2016-05-01'),
				updatedAt: new Date('2020-03-04'),
			},
		},
		'ay',
		'yo',
	);
	expect(mockInsert).toHaveBeenCalledWith({ nick: 'NewGuy' });
});
