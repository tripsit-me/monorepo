'use strict';

const { createTableBuilder } = require('../migration-utils');

exports.up = async function (knex) {
	return knex.schema.createTable('blackout_tests', table => {
		const builder = createTableBuilder(knex, table);
		builder.pk();
		builder.fk('user_id', 'users');

		table
			.uuid('issuer')
			.references('id')
			.inTable('users');

		table.text('phrase').notNullable();
		table.text('answer');

		table
			.integer('minutes')
			.unsigned()
			.notNullable()
			.defaultTo(20);

		table.timestamps(true, true);
	});
};

exports.down = async function (knex) {
	return knex.schema.dropTableIfExists('blackout_tests');
};
