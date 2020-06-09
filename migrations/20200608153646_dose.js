'use strict';

const sql = require('fake-tag');
const { column } = require('../migration-utils');

exports.up = async function up(knex) {
	await knex.raw(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

	await knex.schema.createTable('nick', table => {
		column.pk(table, knex);
		table
			.text('nick')
			.notNullable()
			.unique();
	});

	return knex.schema.createTable('dose', table => {
		table
			.uuid('id')
			.defaultTo(knex.raw('uuid_generate_v4()'))
			.notNullable()
			.primary();

		table
			.uuid('nick_id')
			.notNullable()
			.references('id')
			.inTable('nick');
		table.text('drug').notNullable();
		table.text('dose').notNullable();
		table.timestamp('dosed_at').notNullable();
	});
};

exports.down = async function up(knex) {
	await knex.schema.dropTableIfExists('dose');
	await knex.schema.dropTableIfExists('nick');
	return knex.raw(sql`DROP EXTENSION IF EXISTS "uuid-ossp";`);
};
