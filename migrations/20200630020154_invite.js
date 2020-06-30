'use strict';

const { createTableBuilder } = require('../migration-utils');

exports.up = async function (knex) {
	await knex.schema.createTable('channels', table => {
		const builder = createTableBuilder(knex, table);
		builder.pk();
		table
			.text('name')
			.notNullable()
			.unique();
		table.timestamps(true, true);
	});

	return knex.schema.createTable('invites', table => {
		const builder = createTableBuilder(knex, table);
		builder.pk();
		builder.fk('channel_id', 'channels');
		builder.fk('user_id', 'users');
		table.timestamps(true, true);
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('invites');
	return knex.schema.dropTableIfExists('channels');
};
