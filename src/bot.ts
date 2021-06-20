import discord, { Client } from 'discord.js-commando';
import {promises as fs} from 'fs';
import { join } from 'path';

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
		client = new discord.Client({
			commandPrefix: config.prefix,
			owner: config.ownerID
		});
		client.login(config.token);
		registerEvents();
		await registerCommands();
		return new Promise((resolve) => {
			client.on('ready', () => {
				logger.info(`Erin is logged in as ${client.user.tag}`, { service: 'Discord' });
				client.user.setActivity('Hello, I\'m Erin!');
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
	client.on('messageDelete', message => {
		logger.debug(`Message deleted : "${message.content}" by ${message.author.tag}`, { service: 'Experiment'});
	});
}

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
			} catch(e) {
				logger.error(`Unable to register command from file "${file}" : ${e}`);
			}
		}
	}
}

export function getGuild(id: string) {
	const guild = Array.from(getErin().guilds.cache.values()).find(g => g.id === id);
	return guild;
}