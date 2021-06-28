import {promises as fs} from 'fs';
import {resolve} from 'path';

import { Config } from '../types/config';
import logger from './logger';
import { getState } from './state';

let config: Config;

export async function readConfig() {
	try {
		const configData = await fs.readFile(resolve(getState().dataPath, 'config.json'), 'utf-8');
		config = JSON.parse(configData);
		logger.info('Configuration loaded', {service: 'Config'});
		//logger.debug('Parsed configuration', {service: 'Config', obj: config});
	} catch (err) {
		logger.error('Unable to read config', {service: 'Config', obj: err});
		throw err;
	}
}

export function getConfig() {
	return {...config};
}