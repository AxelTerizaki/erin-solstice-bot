import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { showInventory } from '../../services/game';

export default class InventoryCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'inventory',
			aliases: ['inv'],
			group: 'game',
			memberName: 'inventory',
			description: 'List available items in the store',
			args: [],
			guildOnly: true
		});
	}

	run(message: CommandoMessage) {
		showInventory(message, message.member.id);
		return null;
	}
}