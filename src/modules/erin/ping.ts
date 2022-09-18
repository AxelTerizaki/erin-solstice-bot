import { Message } from 'discord.js';

export default class PingCommand {
	run(message: Message) {
		return message.reply('Bonjour!');
	}
}