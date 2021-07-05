import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { setupItem } from '../../services/game';

export default class SetItemCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'setitem',
			aliases: [],
			group: 'game',
			memberName: 'setitem',
			description: 'Setup an item',
			args: [
				{
					key: 'emote',
					prompt: 'Argument `emote` is mandatory.',
					label: 'Emote for this item',
					type: 'default-emoji|custom-emoji'
				},{
					key: 'price',
					prompt: 'Argument `price` is mandatory.',
					label: 'Unit price. If zero, item will be removed.',
					type: 'integer',
					min: 0
				},
				{
					key: 'name',
					prompt: 'You can provide a name (emote will be used if no name is provided)',
					label: 'Name of the item',
					type: 'string',
					default: ''
				}
			],
			userPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	run(message: CommandoMessage, args: any) {
		const n = args.name.trim();
		setupItem(message, n.length? n:args.emote, args.emote, args.price);
		return null;
	}
}