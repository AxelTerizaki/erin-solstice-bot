import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { remove as rmRole } from '../../services/autoAssignRole';

export default class RoleRemoveCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'roleremove',
			aliases: ['unassign'],
			group: 'autoassignroles',
			memberName: 'roleremove',
			description: 'Unassign yourself a role',
			args: [
				{
					key: 'role',
					prompt: 'Argument "role" is mandatory',
					label: 'role full name',
					type: 'string'
				}
			],
			guildOnly: true
		});
	}

	async run(message: CommandoMessage, args: any) {
		return rmRole(message, args.role);
	}
}