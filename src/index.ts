import { setState } from './util/state';
import {resolve} from 'path';
import { initErin } from './bot';
import { initPing } from './modules/ping';

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