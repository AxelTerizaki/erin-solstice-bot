import { User } from '../types/entities/users';
import { getDB } from './db';
import { selectInventory, selectUser, updateUserMoney, upsertInventory } from './sql/users';

export const managers = {};

export function getUserManager(guildId: string): UserManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new UserManagerService(guildId);
	}
	return managers[guildId];
}

export async function getCurrentUser(guildId: string, memberId: string): Promise<User> {
	return getUserManager(guildId).getUser(memberId);
}

export default class UserManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

	guildId: string;

	async getUser(id: string): Promise<User> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectUser, { id });
		return res[0];
	}

	async updateMoney(id: string, money: number) {
    	const db = await getDB(this.guildId);
    	await db.run(updateUserMoney, { id, money });
	}	

	async addItemToInventory(userid: string, itemid: number, nb: number) {
    	const db = await getDB(this.guildId);
    	await db.run(upsertInventory, {
			nb,
			userid,
			itemid
		});
	}

	async listInventory(userid: string) {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectInventory, { userid });
		return res;
	}
}