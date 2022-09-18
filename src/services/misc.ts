
import { ChatInputCommandInteraction } from 'discord.js';

import logger from '../util/logger';

export async function ping(message: ChatInputCommandInteraction) {
	try {
		message.reply({ content: 'PONG' });
	} catch (err) {
		logger.error('Error while pinging', {obj: err, service: 'misc'});
	}
	return null;
}
