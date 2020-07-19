'use strict';

if (!process.env.POSTGRES_USER) require('dotenv').config(); // eslint-disable-line global-require
const stringcase = require('knex-stringcase');

module.exports = stringcase({
	client: 'pg',
	connection: {
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
	},
});
