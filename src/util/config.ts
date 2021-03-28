import {resolve} from 'path';

import { Config } from '../types/config';
import { asyncReadFile } from './files';
import logger from './logger';
import { getState } from './state';

let config: Config;

export async function readConfig() {
	try {
		const configData = asyncReadFile(resolve(getState().dataPath, 'config.json'), 'utf-8');
		config = JSON.parse(configData);
		logger.info('Parsed configuration', {service: 'Config', obj: config});
	} catch(err) {
		logger.error('Unable to read config', {service: 'Config', obj: err});
		throw err;
	}
}

export function getConfig() {
	return {...config};
}