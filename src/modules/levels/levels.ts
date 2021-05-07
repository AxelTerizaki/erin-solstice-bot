import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { getGuildLevels } from '../../services/levels';

export default class LevelsDisplayCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'levels',
			aliases: ['lvl'],
			group: 'levels',
			memberName: 'levels',
			description: 'Display levels on the server',
			guildOnly: true
		});
	}

	async run(message: CommandoMessage) {
		return getGuildLevels(message);
	}
}