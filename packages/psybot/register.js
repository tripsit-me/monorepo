'use strict';

const { Client } = require('irc-framework');
const config = require('./config');

const client = new Client();
client.connect({
	encoding: 'utf8',
	host: config.host,
	port: config.port,
});

function debugLogMiddleare() {
	return (middlewareClient, rawEvents, parsedEvents) => {
		parsedEvents.use((command, event, eventClient, next) => {
			console.log(command);
			console.log(event);
			next();
		});
	};
}

function registerMiddleware() {
	return (middlewareClient, rawEvents, parsedEvents) => {
		parsedEvents.use((command, event, eventClient, next) => {
			console.log(event.params?.[1]);
			const isNickservNotice = command === 'notice' && event.ident.toLowerCase() === 'nickserv';
			if (isNickservNotice && /^This\ nickname\ is\ registered/.test(event.message)) {
				console.error(`Nick '${config.nick}' is already registered.`);
				process.exit(1);
			} else if (event.params?.[1] === 'You have not registered') {
				client.say('nickserv', `register ${config.password} ${config.recoveryEmail}`);
			}
			next();
		});
	};
}

client.use(debugLogMiddleare());
client.use(registerMiddleware());

client.on('debug', console.error);
client.on('registered', () => {
	console.log('AYYO');
});

client.changeNick(config.nick);
