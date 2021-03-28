import {resolve} from 'path';

import { initErin } from './bot';
import { initPing } from './modules/ping';
import { setState } from './util/state';

setState({
	appPath: process.cwd(),
	dataPath: resolve(process.cwd(), 'data/')
});

async function main() {
	initErin();
	initPing();
}

main().catch(err => {
	console.log(err);
});