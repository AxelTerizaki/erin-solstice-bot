import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { daily } from '../../services/gamecore';

export default class DailyCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'daily',
			aliases: [],
			group: 'game',
			memberName: 'daily',
			description: 'Executes a daily task. Use `daily help` to get a list of available tasks.',
			args: [
				{
					key: 'type',
					prompt: 'Argument `type` is mandatory. Use `help` to get a list of available types.',
					label: 'Type of daily task',
					type: 'string'
				}
			],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		return daily(message, args.type);
	}
}