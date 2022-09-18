import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

import { getConfig } from './util/config';
import logger from './util/logger';

// import commands
import { pingCommands } from './commands/ping';
import { ping } from './services/misc';

let client: Client;

export function getErin() {
	return client;
}

export async function connectBot(): Promise<void> {
	const config = getConfig();
	try {
		logger.info('Logging in...', { service: 'Discord' });
		client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});
		
		return new Promise((resolve) => {
			client.once('ready', () => {
				client.login(config.token);
				registerCommands(); // @TODO wtf is happening is await here ? registerCommands is an async call tho
				registerEvents(); // will also bind the slash commands handling
				logger.info(`Erin is logged in as ${client.user.tag}`, { service: 'Discord' });
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

	client.on('interactionCreate', (interaction) => {
		if(!interaction.isChatInputCommand()) { return; } // reject direct calls

		if (interaction.commandName === 'ping') {
			ping(interaction);
		}

	});
}

async function registerCommands() {
	const commandsToRegister = [
		...pingCommands
	];
	const slashCommands = [];
	for(const cmd of commandsToRegister) {
		slashCommands.push(formatRegisteringSlashCommand(cmd.name, cmd.desc, cmd.options));
	}
	return registerSlashCommands(slashCommands.map(cmd => cmd.toJSON()));
}

export function getGuild(id: string) {
	const guild = Array.from(getErin().guilds.cache.values()).find(g => g.id === id);
	return guild;
}

/**
 * Format a command to slash command output format, ready to use
 */
function formatRegisteringSlashCommand(name: string, desc: string, options: any[]): SlashCommandBuilder {
	const scb = new SlashCommandBuilder();
	scb.setName(name);
	scb.setDescription(desc);
	for(const o of options) {
		scb.addStringOption(o); // @TODO fix that shiet
	}
	return scb;
}

/**
 * Send all slash commands in one REST batch
 */
async function registerSlashCommands(commands: string[]) {
	const config = getConfig();
	const rest = new REST({ version: '10' }).setToken(config.token);
	try {
		await rest.put(Routes.applicationCommands(config.ownerID), { body: commands })
			.then(() => {
				logger.info(`Erin just registered slash commands`, { service: 'Discord' });
			})
			.catch(console.error);
	} catch(err) {
		logger.error('Failed to register slash commands', { service: 'Discord', obj: err });
	}
}