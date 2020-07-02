'use strict';

const { DateTime } = require('luxon');
const { scheduleJob } = require('node-schedule');

module.exports = async function createStore({ db }) {
	const state = {
		channels: [],
		blackoutTests: await db('blackout_tests')
			.select('id', 'minutes', 'created_at')
			.whereNotNull('given_answer')
			.where('created_at', '>=', DateTime
				.utc()
				.minus({ minutes: 61 })
				.toJSDate())
			.then(tests => tests.map(test => ({
				id: test.id,
				scheduleJob: DateTime
					.utc(test.createdAt)
					.plus({ minutes: test.minutes })
					.toJSDate(),
			}))),
	};

	return {
		addChannels(channels) {
			Object.assign(state, { channels: state.channels.concat(channels) });
		},

		async getChannel(name) {
			const channel = state.channels.find(a => a.name === name);
			if (!name) return null;
			await new Promise(resolve => channel.updateUsers(resolve));
			return channel;
		},

		addBlackoutTest(id, minutes) {
			Object.assign(state, {
				blackoutTests: state.blackoutTestJobs.concat({
					id,
					job: scheduleJob(DateTime
						.utc()
						.plus({ minutes })
						.toJSDate()),
				}),
			});
		},
	};
};
