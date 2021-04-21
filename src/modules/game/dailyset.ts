import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { dailyset } from '../../services/gamecore';

export default class DailySetCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'dailyset',
			aliases: [],
			group: 'game',
			memberName: 'dailyset',
			description: 'Setup a daily task',
			args: [
				{
					key: 'type',
					prompt: 'Argument "type" is mandatory',
					label: 'Type of daily task',
					type: 'string'
				},{
					key: 'amount',
					prompt: 'Argument "amount" is mandatory',
					label: 'Amount given for this daily task',
					type: 'integer'
				}
			],
			userPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		return dailyset(message, args.type, args.amount);
	}
}