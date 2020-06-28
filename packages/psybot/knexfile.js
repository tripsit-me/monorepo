'use strict';

const stringcase = require('knex-stringcase');
const config = require('./config');

module.exports = stringcase({
	client: 'pg',
	connection: config.db,
});
