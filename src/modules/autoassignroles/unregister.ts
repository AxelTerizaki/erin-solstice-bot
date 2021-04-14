import {Client, Command, CommandoMessage} from 'discord.js-commando';

import { unregister as unregisterRole } from '../../services/autoAssignRole';

export default class RoleUnregisterCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'roleunregister',
			aliases: ['unregister'],
			group: 'autoassignroles',
			memberName: 'roleunregister',
			description: 'Remove a role from auto-assignable roles list. You need to be able to manage roles in order to do that.',
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
		return unregisterRole(message, args.role);
	}
}