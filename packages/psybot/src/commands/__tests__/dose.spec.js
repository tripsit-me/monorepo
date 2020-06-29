'use strict';

const dateMock = require('jest-date-mock');
const idose = require('../dose');

jest.mock('../traits/with-user');
jest.mock('../../../config', () => ({ nick: 'PsyBot-test-config' }));

const insert = jest.fn();
const db = jest.fn().mockReturnValue({ insert });

beforeEach(() => {
	jest.clearAllMocks();
	dateMock.clear();
});

test('Can only be used over PM', async () => {
	const event = {
		reply: jest.fn(),
		target: '#foo',
		nick: 'MrTibbleNickle',
	};
	await idose({ event, db }, 'amphetamine', '5mg', null);
	expect(db).not.toHaveBeenCalled();
	expect(event.reply).toHaveBeenCalledWith('This command is only available through PM');
	expect(event.reply).toHaveBeenCalledTimes(1);
});

test('Dose argument is required', async () => {
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'MrTibbleNickle',
	};
	await idose({ event, db }, 'amphetamine');
	expect(db).not.toHaveBeenCalled();
	expect(event.reply).toHaveBeenCalledWith('Please provide a dosage for the substance. '
		+ 'Run !help idose for additional assistance.');
	expect(event.reply).toHaveBeenCalledTimes(1);
});

test('Successful input without timeOffset', async () => {
	const date = new Date('2020-01-01');
	dateMock.advanceTo(date);
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'MrTibbleNickle',
	};
	const user = { id: 'mockUserId' };

	await idose({ event, db, user }, '15mg', 'amphetamine');
	expect(db).toHaveBeenCalled();
	expect(insert).toHaveBeenCalledWith({
		substance: 'amphetamine',
		dosedAt: date,
		userId: 'mockUserId',
		milligrams: 15,
	});
	expect(event.reply).toHaveBeenCalledTimes(1);
	expect(event.reply).toHaveBeenCalledWith('MrTibbleNickle dosed 15mg of amphetamine at '
		+ `${date.toLocaleString()}`);
});

test('Successful input with timeOffset', async () => {
	const date = new Date('2020-01-01');
	dateMock.advanceTo(date);
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'DankSwaggins',
	};
	const user = { id: 'mockUserId' };

	await idose({ event, db, user }, '15mg', 'hamburgers', '1h');
	expect(db).toHaveBeenCalled();
	expect(insert).toHaveBeenCalledWith({
		substance: 'hamburgers',
		dosedAt: new Date(date - 3.6e+6), // Subtract 1h
		userId: 'mockUserId',
		milligrams: 15,
	});
	expect(event.reply).toHaveBeenCalledTimes(1);
	expect(event.reply).toHaveBeenCalledWith('DankSwaggins dosed 15mg of hamburgers at '
		+ `${new Date(date - 3.6e+6).toLocaleString()}`);
});

test('Converts dose to mg for DB call', async () => {
	const date = new Date('2020-01-01');
	dateMock.advanceTo(date);
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'MrTibbleNickle',
	};
	const user = { id: 'mockUserId' };

	await idose({ event, db, user }, '5g', 'phenibut');
	expect(db).toHaveBeenCalled();
	expect(insert).toHaveBeenCalledWith({
		substance: 'phenibut',
		dosedAt: date,
		userId: 'mockUserId',
		milligrams: 5000,
	});
	expect(event.reply).toHaveBeenCalledTimes(1);
	expect(event.reply).toHaveBeenCalledWith('MrTibbleNickle dosed 5g of phenibut at '
		+ `${date.toLocaleString()}`);
});

test('Uses all remaining args for substance name', async () => {
	const date = new Date('2020-01-01');
	dateMock.advanceTo(date);
	const event = {
		reply: jest.fn(),
		target: 'PsyBot-test-config',
		nick: 'DankSwaggins',
	};
	const user = { id: 'mockUserId' };

	await idose({ event, db, user }, '15mg', 'pickle', 'of', 'strength', '1h');
	expect(db).toHaveBeenCalled();
	expect(insert).toHaveBeenCalledWith({
		substance: 'pickle of strength',
		dosedAt: new Date(date - 3.6e+6), // Subtract 1h
		userId: 'mockUserId',
		milligrams: 15,
	});
	expect(event.reply).toHaveBeenCalledTimes(1);
	expect(event.reply).toHaveBeenCalledWith('DankSwaggins dosed 15mg of pickle of strength at '
		+ `${new Date(date - 3.6e+6).toLocaleString()}`);
});
