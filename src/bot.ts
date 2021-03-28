import discord, { Client } from 'discord.js';

import { getConfig, readConfig } from './util/config';

let client: Client;

export function getErin() {
	return client;
}

export function initErin() {
	readConfig();
	const config = getConfig();
	client = new discord.Client();
	client.login(config.token);
	console.log('Erin is ready.');
}