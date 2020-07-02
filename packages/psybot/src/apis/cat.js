/**
 * Gets images of cats
 * @see https://docs.thecatapi.com/
 */

'use strict';

const axios = require('axios');

const client = axios.create({
	baseURL: 'https://api.thecatapi.com',
	timeout: 10000,
	headers: { Accepts: 'application/json' },
});

client.interceptors.response(res => res.data);

module.exports = client;
