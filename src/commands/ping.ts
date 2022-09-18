import { ping } from '../services/misc';

export const pingCommands = [{
	name: 'ping',
	group: 'misc',
	desc: '',
	options: [],
	func: ping
}];
