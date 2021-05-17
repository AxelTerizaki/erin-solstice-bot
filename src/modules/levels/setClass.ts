import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { setLevelClass } from '../../services/levels';

export default class LevelsSetClassCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'setclass',
			aliases: ['sc', 'class'],
			group: 'levels',
			memberName: 'setclass',
			description: 'Assign yourself a class for your level',
			args: [
				{
					key: 'class',
					prompt: 'Argument "class" is required',
					label: 'class full name',
					type: 'string'
				}
			],
			guildOnly: true
		});
	}

	async run(message: CommandoMessage, args: any) {
		return setLevelClass(message, args.class);
	}
}