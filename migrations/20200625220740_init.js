'use strict';

const sql = require('fake-tag');
const { createTableBuilder } = require('../migration-utils');

exports.up = async function (knex) {
	await knex.raw(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

	await knex.schema.createTable('users', table => {
		const builder = createTableBuilder(knex, table);
		builder.pk();
		table
			.string('nick', 30)
			.notNullable()
			.unique();
		table.timestamps(true, true);
	});

	return knex.schema.createTable('doses', table => {
		const builder = createTableBuilder(knex, table);
		builder.pk();
		builder.fk('user_id', 'users');
		table.text('substance').notNullable();
		table
			.datetime('dosed_at')
			.notNullable()
			.defaultTo(knex.fn.now());
		table.float('milligrams');
	});
};

exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('doses');
	await knex.schema.dropTableIfExists('users');
	return knex.raw(sql`DROP EXTENSION IF EXISTS "uuid";`);
};
