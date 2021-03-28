import discord, { Client } from 'discord.js';

import { getConfig } from './util/config';
import logger from './util/logger';

let client: Client;

export function getErin() {
	return client;
}

export function connectBot() {
	const config = getConfig();
	try {
		logger.info('Logging in...', {service: 'Discord'});
		client = new discord.Client();
		client.login(config.token);
		logger.info('Logged in Erin!', {service: 'Discord'});
	} catch(err) {
		logger.error('Failed to login', {service: 'Discord', obj: err});
		throw err;
	}
}