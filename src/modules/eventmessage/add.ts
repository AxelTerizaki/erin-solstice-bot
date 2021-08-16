import {Client, Command, CommandoMessage} from 'discord.js-commando';

//import { setReminder } from '../../services/reminders';

export default class AddNewEventMessage extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'addMessage',
			aliases: ['add', 'addmessage'],
			group: 'eventMessage',
			memberName: 'addMessage',
			description: 'Add a message to help Erin welcoming or wishing a good trip to an user',
			args: [
				{
					key: 'type',
					prompt: 'Argument "type" is mandatory',
					label: 'in or out',
					type: 'string'
				},
                {
                    key: 'message',
                    prompt: 'Argument "message" is mandatory',
                    label: 'whatever',
                    type: 'string',
                },
			],
			guildOnly: true
		});
	}

	async run(message: CommandoMessage, args: any) {
//		return setReminder(message, args.date, args.text);
	}
}
