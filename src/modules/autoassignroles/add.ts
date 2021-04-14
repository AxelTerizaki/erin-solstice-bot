import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { add as addRole } from '../../services/autoAssignRole';

export default class RoleAddCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'roleadd',
			aliases: ['role', 'r', 'assign'],
			group: 'autoassignroles',
			memberName: 'roleadd',
			description: 'Assign yourself a role',
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
		return addRole(message, args.role);
	}
}