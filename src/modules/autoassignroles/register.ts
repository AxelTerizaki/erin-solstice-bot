import { Client, Command, CommandoMessage } from 'discord.js-commando';

import { register as registerRole } from '../../services/autoAssignRole';

export default class RoleRegisterCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'roleregister',
			aliases: ['register'],
			group: 'autoassignroles',
			memberName: 'roleregister',
			description: 'Add a role to auto-assignable roles list. You need to be able to manage roles in order to do that.',
			args: [
				{
					key: 'role',
					prompt: 'Argument "role" is mandatory',
					label: 'role full name',
					type: 'string'
				}
			],
			userPermissions: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	async run(message: CommandoMessage, args: any) {
		return registerRole(message, args.role);
	}
}