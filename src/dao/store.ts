import { Item } from '../types/entities/items';
import { getDB } from './db';
import { deleteItem, selectItems, upsertItem } from './sql/store';

export const managers = {};

export function getShopManager(guildId: string): ShopManagerService {
	if (!(guildId in managers)) {
		managers[guildId] = new ShopManagerService(guildId);
	}
	return managers[guildId];
}

export default class ShopManagerService {
	constructor(guildID: string) {
		this.guildId = guildID;
	}

	guildId: string;

	async getShop(): Promise<Item[]> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectItems());
		return res;
	}

	async findItemByAny(criteria: string): Promise<Item> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectItems(criteria), {search: criteria});
		return res[0];
	}

	async findItem(id: number): Promise<Item> {
    	const db = await getDB(this.guildId);
    	const res = await db.query(selectItems(null, id), { id });
		return res[0];
	}

	async saveItem(emote: string, name: string, price: number, id?: number) {
    	const db = await getDB(this.guildId);
		await db.run(upsertItem, {
			emote,
			name,
			id,
			price: Math.floor(Math.max(0, price))
		});
	}

	async removeItem(id: number) {
    	const db = await getDB(this.guildId);
    	await db.run(deleteItem, { id });
	}
}