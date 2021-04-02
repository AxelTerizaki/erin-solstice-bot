import {resolve} from 'path';

import { connectBot, getErin } from './bot';
//import Setting from './entities/settings';
import { readConfig } from './util/config';
import Database from './util/db';
import { asyncCheckOrMkdir } from './util/files';
import logger, { configureLogger } from './util/logger';
import { getState, setState } from './util/state';

setState({
	appPath: process.cwd(),
	dataPath: resolve(process.cwd(), 'data/')
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
		// Sample code to insert data, delete later
		/*
		const manager = guildDB.connection.manager;
		await manager.insert(Setting, {
			setting: 'Test',
			value: 'lol'
		});
		*/
	}

}

main().catch(err => {
	console.log(err);
});