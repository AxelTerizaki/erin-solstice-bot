import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { buyItem } from '../../services/game';

export default class BuyCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'buy',
			aliases: [],
			group: 'game',
			memberName: 'buy',
			description: 'Buy an item',
			args: [
				{
					key: 'item',
					prompt: 'Argument "item" is mandatory',
					label: 'Item name or emote',
					type: 'string'
				},
				{
					key: 'nb',
					prompt: 'Argument "nb" is optional, default as 1',
					label: 'Number of items to buy',
					type: 'integer',
					default: 1,
					min: 1
				}
			],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		buyItem(message, message.member.id, args.item, args.nb);
		return null;
	}
}