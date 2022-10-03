import { UserLevel } from '../types/entities/levels';
import { getDB } from './db';
import { selectUserLevel, upsertUserLevel } from './sql/levels';

export const managers = {};

export function getLevelManager(guildId: string): UserLevelManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new UserLevelManagerService(guildId);
	}
	return managers[guildId];
}

export default class UserLevelManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

	guildId: string;

	async getUserLevel(id: string): Promise<UserLevel> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectUserLevel(false), { id });
		return res[0];    	
	}

	async getGuildLevels(): Promise<UserLevel[]> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectUserLevel(true));
    	return res;
	}

	async saveLevel(user: UserLevel) {
    	const db = await getDB(this.guildId);
    	await db.run(upsertUserLevel, user);
	}
}