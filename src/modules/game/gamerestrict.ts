import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { getRestricted, restrict } from '../../services/game';

export default class GameRestrictCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'gamerestrict',
			aliases: [],
			group: 'game',
			memberName: 'gamerestrict',
			description: 'Restrict the game commands to the current channel.',
			args: [
				{
					key: 'option',
					prompt: 'Option `on` or `off` is mandatory',
					label: '`on` to enable, `off` to disable, `help` to see the current status',
					type: 'string',
					oneOf: ['on', 'off', 'help']
				}
			],
			userPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		return args.option === 'help'
			? getRestricted(message)
			: restrict(message, args.option === 'on');
	}
}