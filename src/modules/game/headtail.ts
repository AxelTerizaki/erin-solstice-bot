import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { headTail } from '../../services/game';

export default class HeadTailCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'headtail',
			aliases: ['ht', 'toss', 't'],
			group: 'game',
			memberName: 'headtail',
			description: 'Toss a coin, betting money.',
			args: [
				{
					key: 'bet',
					prompt: 'Argument `bet` is mandatory.',
					label: 'Type of daily task',
					type: 'integer',
					min: 1
				}
			],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		return headTail(message, args.bet);
	}
}