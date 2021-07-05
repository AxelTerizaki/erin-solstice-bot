import { Message } from 'discord.js';
import {Client, Command} from 'discord.js-commando';

import { money } from '../../services/game';

export default class MoneyCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'money',
			aliases: ['m'],
			group: 'game',
			memberName: 'money',
			description: 'Display how much money you have on this current server. \
If sent in a DM, will show how much money you have in every server using Erin\'s services.'
		});
	}

	run(message: Message) {
		return money(message);
	}
}