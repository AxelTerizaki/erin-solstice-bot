import User from '../entities/users';
import { getDB } from '../util/db';

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

    guildId: string

    /**
     * 
     * @param id 
     * @returns 
     */
    async getUser(id: string): Promise<User> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(User);
    	return repo.findOne(id);
    }

    /**
     * Save an user, replacing their money.
     * @param id member ID (snowflake format)
     * @param money money to change with
     * @returns 
     */
    async saveMoney(id: string, money: number): Promise<User> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(User);
    	const r = new User();
    	r.id = id;
    	r.money = money;
    	return repo.save(r);
    }

    /**
     * Save an user, adding or removing some money.
     * @param id member ID (snowflake format)
     * @param addingMoney money to add (or to remove if negative)
     * @returns 
     */
    async changeMoney(id: string, addingMoney: number): Promise<User> {
    	const db = getDB(this.guildId);
    	const repo = db.connection.getRepository(User);
    	let r = await this.getUser(id);
    	if (r) {
    		r.money += addingMoney;
    	} else {
    		r = new User();
    		r.id = id;
    		r.money = addingMoney;
    	}
    	return repo.save(r);
    }
}