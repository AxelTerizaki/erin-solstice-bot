import { Message } from 'discord.js';
import {Client, Command} from 'discord.js-commando';

export class PingCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'ping',
			aliases: ['coucou', 'salut'],
			group: 'erin',
			memberName: 'ping',
			description: 'Replies with a welcome ping.',
			/** Leaving this for example purposes
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string',
				},
			],
			*/
		});
	}

	run(message: Message) {
		return message.reply('Bonjour!');
	}
}