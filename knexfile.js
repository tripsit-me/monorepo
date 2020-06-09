'use strict';

const path = require('path');
const knexStringcase = require('knex-stringcase');

module.exports = knexStringcase({
	client: 'sqlite3',
	connection: { filename: path.resolve('./db.sqlite3') },
});
