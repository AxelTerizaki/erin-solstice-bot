import { getErin } from '../bot';
import { registerCommand } from '../util/http';
import logger from '../util/logger';

export async function registerPing() {
	await registerCommand({
		name: 'ping',
		description: 'Say Hello to Erin!'
	});
}

export async function initPing() {
	const erin = getErin();
	erin.on('message', message => {
		if (message.author.bot) return;
		if (message.content === 'Coucou Erin') message.reply('Coucou!');
	});
	logger.info('Module registred', {service: 'Ping'});
}