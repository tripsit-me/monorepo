'use strict';

exports.createTableBuilder = function createTableBuilder(knex, table) {
	return {
		pk(name = 'id') {
			return table
				.uuid(name)
				.notNullable()
				.defaultTo(knex.raw('uuid_generate_v4()'))
				.primary();
		},

		fk(name, inTable, references = 'id') {
			return table
				.uuid(name)
				.notNullable()
				.references(references)
				.inTable(inTable)
				.onDelete('cascade');
		},
	};
};
