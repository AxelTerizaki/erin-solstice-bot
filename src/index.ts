import {resolve} from 'path';

import { connectBot, getErin } from './bot';
import Database from './dao/db';
import { initLevels } from './services/levels';
import { initReminders } from './services/reminders';
//import Setting from './entities/settings';
import { readConfig } from './util/config';
import { asyncCheckOrMkdir } from './util/files';
import logger, { configureLogger } from './util/logger';
import { getState, setState } from './util/state';

setState({
	appPath: process.cwd(),
	dataPath: resolve(process.cwd(), 'data/')
});

process.on('uncaughtException', err => {
	console.log(err);
});

async function main() {
	// Make sure folders exist
	await asyncCheckOrMkdir(resolve(getState().dataPath, 'db/'));
	await asyncCheckOrMkdir(resolve(getState().dataPath, 'logs/'));

	// Setting debug logging to true while we're developing.
	await configureLogger(getState().dataPath, true);
	logger.info('Initializing...', {service: 'Erin'});
	await readConfig();

	// Bot code starts here.
	await connectBot();
	for (const guild of getErin().guilds.cache.values()) {
		logger.info(`Serves ${guild.name}`, {service: 'Guilds'});
		const guildDB = new Database(guild.id);
		await guildDB.init();
	}
	initLevels();
	initReminders();


}

main().catch(err => {
	console.log(err);
});