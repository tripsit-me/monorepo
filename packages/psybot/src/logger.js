'use strict';

const path = require('path');
const winston = require('winston');
const config = require('../config');

module.exports = function createLogger() {
	const baseLogPath = path.resolve('../../logs/psybot');

	const logger = winston.createLogger({
		logger: 'info',
		format: winston.format.json(),
		exitOnError: false,
		defaultMeta: { service: config.nick },
		transports: [
			new winston.transports.File({ filename: path.join(baseLogPath, 'combined.log') }),
			new winston.transports.File({
				filename: path.join(baseLogPath, 'error.log'),
				level: 'error',
			}),
		],
	});

	if (process.env.DEBUG === 'true') {
		logger.add(new winston.transports.Console({ format: winston.format.simple() }));
	}

	return logger;
};
