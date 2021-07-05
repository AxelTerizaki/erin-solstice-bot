import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { listItems } from '../../services/game';

export default class StoreCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'store',
			aliases: ['shop'],
			group: 'game',
			memberName: 'store',
			description: 'List available items in the store',
			args: [],
			guildOnly: true
		});
	}

	run(message: CommandoMessage) {
		listItems(message);
		return null;
	}
}