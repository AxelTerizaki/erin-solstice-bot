import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { getReminders } from '../../services/reminders';

export default class GetRemindersCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'reminders',
			aliases: [],
			group: 'reminders',
			memberName: 'reminders',
			description: 'List your reminders',
			guildOnly: true
		});
	}

	async run(message: CommandoMessage) {
		await getReminders(message);
		return null;
	}
}