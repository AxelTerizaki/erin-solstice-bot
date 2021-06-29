import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { removeReminder } from '../../services/reminders';

export default class SetReminderCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'forgetreminder',
			aliases: ['forget', 'delreminder'],
			group: 'reminders',
			memberName: 'forgetreminder',
			description: 'Remove a reminder',
			args: [
				{
					key: 'id',
					prompt: 'Argument "id" is mandatory',
					label: 'ID number',
					type: 'integer'
				},
			],
			guildOnly: false
		});
	}

	async run(message: CommandoMessage, args: any) {
		return removeReminder(message, args.id);
	}
}