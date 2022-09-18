import { Client, Intents } from 'discord.js';
import {promises as fs} from 'fs';
import { join } from 'path';

//import { REST } from '@discordjs/rest';
//import { Routes } from 'discord-api-types/v9';

import { getConfig } from './util/config';
import logger from './util/logger';


let client: Client;

export function getErin() {
	return client;
}

export async function connectBot(): Promise<void> {
	const config = getConfig();
	try {
		logger.info('Logging in...', { service: 'Discord' });
		client = new Client({
			intents: [Intents.FLAGS.GUILDS]
		});
		await registerCommands();
		registerEvents();
		client.login(config.token);
		return new Promise((resolve) => {
			client.on('ready', () => {
				logger.info(`Erin is logged in as ${client.user.tag}`, { service: 'Discord' });
				//client.user.setActivity('Hello, I\'m Erin!');
				resolve();
			});
			// FIXME : find how to reject if connection fails
		});
	} catch (err) {
		logger.error('Failed to login', { service: 'Discord', obj: err });
		throw err;
	}
}

function registerEvents() {
	client.on('error', (err) => {
		logger.error('Unknown error occured: ', { service: 'Discord', obj: err });
	});
}
/*
async function registerCommands() {
	const groupsToRegister = [
		['erin', 'Erin test commands'],
		['autoassignroles', 'Auto-assignable Roles'],
		['game', 'Money and core game commands'],
		['levels', 'Levels and ranks'],
		['reminders', 'Reminders']
	];
	client.registry
		.registerDefaultTypes()
		.registerGroups(groupsToRegister)
		.registerDefaultGroups()
		.registerDefaultCommands({
			ping: false, // Disabling it since we're making our own
			unknownCommand: false, // Disabling unknown commands response
		});
	for (const actualGroup of groupsToRegister) {
		const groupName = actualGroup[0];
		const modulesDir = join(__dirname, 'modules', groupName);
		const files = await fs.readdir(modulesDir);
		for (const file of files) {
			if (file.endsWith('.map')) continue;
			try {
				client.registry.registerCommand(require(join(modulesDir, file)));
			} catch (e) {
				logger.error(`Unable to register command from file "${file}" : ${e}`);
			}
		}
	}
}
*/
async function registerCommands() {
	const groupsToRegister = [
		['erin', 'Erin test commands'],
		['autoassignroles', 'Auto-assignable Roles'],
		['game', 'Money and core game commands'],
		['levels', 'Levels and ranks'],
		['reminders', 'Reminders']
	];
	const convertedCommands = [];
	for (const actualGroup of groupsToRegister) {
		const groupName = actualGroup[0];
		const modulesDir = join(__dirname, 'modules', groupName);
		const files = await fs.readdir(modulesDir);
		for (const file of files) {
			if (file.endsWith('.map')) continue;
			try {
				console.log(join(modulesDir, file));
				const cmd = require(join(modulesDir, file));
				convertedCommands.push(cmd);
				console.log(cmd);
			} catch (e) {
				logger.error(`Unable to register command from file "${file}" : ${e}`);
			}
		}
	}
	console.log(convertedCommands);

	//const rest = new REST({ version: '9' }).setToken('token');
}

export function getGuild(id: string) {
	const guild = Array.from(getErin().guilds.cache.values()).find(g => g.id === id);
	return guild;
}