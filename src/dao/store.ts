import { MoreThan } from 'typeorm';

import Item from '../types/entities/items';
import { getDB } from '../util/db';

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

    guildId: string

    async getShop(): Promise<Item[]> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Item);
    	return repo.find({ price: MoreThan(0) });
    }

    async findItemByAny(criteria: string): Promise<Item> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Item);
    	return repo.findOne(
    		{ where: [
    			{ id: criteria },
    			{ emote: criteria },
    			{ name: criteria }
    		]
    		});
    }

    async findItem(id: number): Promise<Item> {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Item);
    	return repo.findOne(id);
    }

    async saveItem(emote: string, name: string, price: number, id?: number) {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Item);
    	let item: Item = null;
    	if (id) {
    	    item = await repo.findOne(id);
    	} else {
    		item = new Item();
    	}
    	item.emote = emote;
    	item.name = name;
    	item.price = Math.floor(Math.max(0, price));
    	return repo.save(item);
    }

    async removeItem(id: number) {
    	const db = await getDB(this.guildId);
    	const repo = db.connection.getRepository(Item);
    	return repo.delete(id);
    }
}