import {resolve} from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import Daily from '../entities/dailies';
import DailyUser from '../entities/dailyUsers';
import Inventory from '../entities/inventories';
import Item from '../entities/items';
import UserLevel from '../entities/levels';
import Reminder from '../entities/reminders';
import Role from '../entities/roles';
import Setting from '../entities/settings';
import User from '../entities/users';
import { getState } from './state';

export const dbs = {};

export async function getDB(guildID: string): Promise<Database> {
	// the guild ID is a number, but the property is a string
	if (!dbs[guildID]) {
		// If DB doesn't exist yet create it
		const guildDB = new Database(guildID);
		await guildDB.init();
	}
	return dbs[guildID];
}

export default class Database {
	constructor(guildID: string) {
		this.options = {
			name: guildID,
			type: 'sqlite',
			database: resolve(getState().dataPath, `db/${guildID}.sqlite`),
			logging: false,
			entities: [
				Setting,
				Role,
				User,
				Daily,
				DailyUser,
				Inventory,
				Item,
				Reminder,
				UserLevel
			],
			synchronize: true
		};
		this.guildID = guildID;
	}

	guildID: string
	options: ConnectionOptions
	connection: Connection

	init = async () => {
		this.connection = await createConnection(this.options);
		dbs[`${this.guildID}`] = this;
	}
}

