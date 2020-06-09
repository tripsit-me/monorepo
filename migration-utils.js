'use strict';

exports.column = {
	pk(table, knex, name = 'id') {
		return table
			.uuid(name)
			.defaultTo(knex.raw('uuid_generate_v4()'))
			.notNullable()
			.primary()
			.onDelete('cascade');
	},
};
