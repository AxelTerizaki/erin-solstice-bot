import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { setReminder } from '../../services/reminders';

export default class SetReminderCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'remind',
			aliases: ['reminder', 'remindme'],
			group: 'reminders',
			memberName: 'remind',
			description: 'Add a reminder so Erin can tell you later',
			args: [
				{
					key: 'date',
					prompt: 'Argument "date" is mandatory',
					label: 'Date or number+unit (4d, 1w, 8h, etc.)',
					type: 'string'
				},
				{
					key: 'text',
					prompt: 'Argument "text" is mandatory',
					label: 'Text for the reminder',
					type: 'string'
				},
			],
			guildOnly: true
		});
	}

	async run(message: CommandoMessage, args: any) {
		return setReminder(message, args.date, args.text);
	}
}