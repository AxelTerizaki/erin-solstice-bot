import Inventory from '../types/entities/inventories';
import Item from '../types/entities/items';
import User from '../types/entities/users';
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

	guildId: string;

	/**
     *
     * @param id
     * @returns
     */
	async getUser(id: string): Promise<User> {
    	const db = await getDB(this.guildId);
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
    	const db = await getDB(this.guildId);
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
    	const db = await getDB(this.guildId);
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

	async addItem(userid: string, item: Item, nb: number) {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Inventory);
    	const u = await this.getUser(userid);
    	const inv = await repo.find({where: {user: userid}, relations: ['item', 'user']});
    	if (inv) { // user MUST exist, as we checked their money just before.
    		let lnk = inv.find(i => i.item.id === item.id);
    		if (!lnk) {
    			lnk = new Inventory();
    			lnk.nb = 0;
    			lnk.user = u;
    			lnk.item = item;
    		}
    		lnk.nb += nb;
    		await repo.save(lnk);
    	}
    	return null;
	}

	async listItems(userid: string) {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Inventory);
    	const inv = await repo.find({where: {user: userid}, relations: ['item']});
    	return inv? inv:null;
	}
}