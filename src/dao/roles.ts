import { Role } from 'discord.js';

import { getDB } from './db';
import { deleteRole, insertRole, selectRoles } from './sql/roles';

export const managers = {};

export function getRoleManager(guildId: string): RoleManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new RoleManagerService(guildId);
	}
	return managers[guildId];
}

export default class RoleManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

	guildId: string;

	async registerAutoAssignable(id: string, name: string, assignable: boolean) {
		const db = await getDB(this.guildId);
		await db.run(insertRole, {
			id,
			name: name.toLowerCase(),
			assignable
		});		
	}

	async unregisterAutoAssignable(id: string) {
		const db = await getDB(this.guildId);
		await db.run(deleteRole, {id});
	}

	async getAutoAssignableList(): Promise<Role[]> {
		const db = await getDB(this.guildId);
		const res = await db.query(selectRoles());
		return res;	
	}

	async getAutoAssignable(roleName: string): Promise<Role> {
		const db = await getDB(this.guildId);
		const res = await db.query(selectRoles(roleName), { name: roleName.toLowerCase()});
		return res[0];		
	}	
}