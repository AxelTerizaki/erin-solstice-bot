import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { getLevel } from '../../services/levels';

export default class RankDisplayCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'level',
			group: 'levels',
			memberName: 'rank',
			description: 'Display your own level',
			guildOnly: true
		});
	}

	async run(message: CommandoMessage) {
		return getLevel(message);
	}
}