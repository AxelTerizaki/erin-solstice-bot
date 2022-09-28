import { GuildMember } from 'discord.js';

import Role from '../types/entities/roles';
import { getDB } from '../util/db';

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

	guildId: string

	async registerAutoAssignable(id: string, name: string, assignable: boolean): Promise<Role> {
		const db = await getDB(this.guildId);
		const repo = db.connection.getRepository(Role);
		const r = new Role();
		r.id = id;
		r.name = name.toLowerCase(); // force lowercase anyway
		r.assignable = assignable;
		return repo.save(r);
	}

	async unregisterAutoAssignable(roleId: string): Promise<any> {
		const db = await getDB(this.guildId);
		const repo = db.connection.getRepository(Role);
		return repo.delete(roleId);
	}

	async getAutoAssignableList(): Promise<Role[]> {
		const db = await getDB(this.guildId);
		const repo = db.connection.getRepository(Role);
		return repo.find({
			where: {
				assignable: true
			}
		});
	}

	async getAutoAssignable(roleName: string): Promise<Role> {
		const db = await getDB(this.guildId);
		const repo = db.connection.getRepository(Role);
		return repo.findOne({
			where: {
				assignable: true,
				name: roleName.toLowerCase()
			}
		});
	}

	async addMember(member: GuildMember, roleToGive: Role): Promise<GuildMember> {
		return member.roles.add(roleToGive.id);
	}

	async removeMember(member: GuildMember, roleToRemove: Role): Promise<GuildMember> {
		return member.roles.remove(roleToRemove.id);
	}
}