'use strict';

const { createTableBuilder } = require('../migration-utils');

exports.up = async function (knex) {
	return Promise.all([
		knex.schema.alterTable('users', table => {
			table
				.enum('role', [
					'user',
					'alumini',
					'tripsitter',
					'moderator',
					'operator',
				], {
					useNative: true,
					enumName: 'user_role',
				})
				.notNullable()
				.defaultTo('user');
			table.boolean('is_banned').notNullable().defaultTo(false);
		}),

		knex.schema.createTable('bans', table => {
			const builder = createTableBuilder(knex, table);
			builder.pk();
			builder.fk('banned_user_id', 'users');
			builder.fk('enacted_by', 'users');
			table.datetime('expires');
			table.text('reason').notNullable();
			table.timestamps(true, true);
		}),
	]);
};

exports.down = async function (knex) {
	return Promise.all([
		knex.schema.alterTable('users', table => {
			table.dropColumnIfExists('role');
		}),
		knex.schema.dropTableIfExists('bans'),
	]);
};
