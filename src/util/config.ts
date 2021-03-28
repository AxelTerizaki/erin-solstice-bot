import {readFileSync} from 'fs';
import {resolve} from 'path';

import { Config } from '../types/config';
import { getState } from './state';

let config: Config;

export function readConfig() {
	try {
		const configData = readFileSync(resolve(getState().dataPath, 'config.json'), 'utf-8');
		config = JSON.parse(configData);
	} catch(err) {
		console.log('Unable to read config');
		throw err;
	}
}

export function getConfig() {
	return {...config};
}