import { getErin } from '../bot';
import logger from '../util/logger';

export async function initPing() {
	const erin = getErin();
	erin.on('message', message => {
		if (message.author.bot) return;
		if (message.content === 'Coucou Erin') message.reply('Coucou!');
	});
	logger.info('Module registred', {service: 'Ping'});
}