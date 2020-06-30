'use strict';

const lastdose = require('../lastdose');

jest.mock('../traits/with-user');
jest.mock('../../../config', () => ({ nick: 'PsyBot-test-config' }));

let dbFirst;
let dbOffset;
let db;
beforeEach(() => {
	jest.clearAllMocks();
	dbFirst = jest.fn();
	dbOffset = jest.fn();
	db = jest.fn().mockReturnValue({
		select: jest.fn().mockReturnValue({
			where: jest.fn().mockReturnValue({
				orderBy: jest.fn().mockReturnValue({
					first: dbFirst,
					limit: jest.fn().mockReturnValue({ offset: dbOffset }),
				}),
			}),
		}),
	});
});

test('dosesBack if defined must be greater than 0', async () => {
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'DankSwaggins',
	};
	const user = { id: 'mockUserId' };

	await expect(lastdose({ event, db, user }, '-4')).resolves.toBe(undefined);
	expect(event.reply).toHaveBeenCalledWith('Must use a positive number.');
	await expect(db).not.toHaveBeenCalled();
});

test('Get last dose back', async () => {
	dbFirst.mockResolvedValue({
		milligrams: 40,
		substance: 'Cool Juice',
		dosedAt: new Date('2020-01-01'),
	});
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'DankSwaggins',
	};
	const user = { id: 'mockUserId' };

	await expect(lastdose({ event, db, user })).resolves.toBe(undefined);
	expect(event.reply).toHaveBeenCalledWith('DankSwaggins dosed 40mg of Cool Juice at '
		+ `${new Date('2020-01-01').toLocaleString()}`);
	expect(dbFirst).toHaveBeenCalled();
});

test('Get 2nd last dose back', async () => {
	dbOffset.mockResolvedValue([{
		milligrams: 20,
		substance: 'Cooler Juice',
		dosedAt: new Date('2019-01-01'),
	}]);
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'DankestSwaggins',
	};
	const user = { id: 'mockUserId' };

	await expect(lastdose({ event, db, user }, '2')).resolves.toBe(undefined);
	expect(event.reply).toHaveBeenCalledWith('DankestSwaggins dosed 20mg of Cooler Juice at '
		+ `${new Date('2019-01-01').toLocaleString()}`);
});
