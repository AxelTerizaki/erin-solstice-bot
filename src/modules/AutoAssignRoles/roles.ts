import { Message } from 'discord.js';
import { Client, Command } from 'discord.js-commando';

import { list as listRoles } from '../../services/autoAssignRole';

export default class RolesCommand extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'roles',
			aliases: [],
			group: 'autoassignroles',
			memberName: 'roles',
			description: 'Auto-assignable roles list',
			args: [],
			guildOnly: true
		});
	}

	async run(message: Message) {
		return listRoles(message);
	}
}